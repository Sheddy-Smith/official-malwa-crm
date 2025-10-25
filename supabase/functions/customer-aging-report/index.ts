import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: agingData, error } = await supabase
      .from('customer_aging_analysis')
      .select('*')

    if (error) throw error

    const summary = {
      totalCustomers: agingData.length,
      totalOutstanding: agingData.reduce((sum, c) => sum + (c.current_balance || 0), 0),
      aging_0_30: agingData.reduce((sum, c) => sum + (c.aging_0_30 || 0), 0),
      aging_31_60: agingData.reduce((sum, c) => sum + (c.aging_31_60 || 0), 0),
      aging_61_90: agingData.reduce((sum, c) => sum + (c.aging_61_90 || 0), 0),
      aging_90_plus: agingData.reduce((sum, c) => sum + (c.aging_90_plus || 0), 0),
      customersOnHold: agingData.filter(c => c.on_hold).length,
    }

    const riskAnalysis = agingData.map(customer => ({
      ...customer,
      riskLevel:
        customer.aging_90_plus > 0
          ? 'high'
          : customer.aging_61_90 > 0
          ? 'medium'
          : customer.aging_31_60 > 0
          ? 'low'
          : 'none',
      utilizationPercent:
        customer.credit_limit > 0
          ? ((customer.current_balance / customer.credit_limit) * 100).toFixed(2)
          : 0,
    }))

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          customers: riskAnalysis,
          summary,
          generatedAt: new Date().toISOString(),
        },
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error generating aging report:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})