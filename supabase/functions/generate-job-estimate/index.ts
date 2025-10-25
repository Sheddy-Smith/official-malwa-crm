import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface EstimateItem {
  description: string
  quantity: number
  rate: number
  amount?: number
}

interface GenerateEstimateRequest {
  jobId: string
  items: EstimateItem[]
  gstRate: number
  discount?: number
  notes?: string
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

    const { jobId, items, gstRate, discount = 0, notes }: GenerateEstimateRequest =
      await req.json()

    if (!jobId) {
      throw new Error('Job ID is required')
    }

    if (!items || items.length === 0) {
      throw new Error('At least one item is required')
    }

    const { data: job, error: jobError } = await supabase
      .from('customer_jobs')
      .select(`
        *,
        customers(
          id,
          name,
          company,
          phone,
          address,
          gstin
        )
      `)
      .eq('id', jobId)
      .single()

    if (jobError) throw jobError

    const calculatedItems = items.map((item) => ({
      ...item,
      amount: parseFloat((item.quantity * item.rate).toFixed(2)),
    }))

    const subtotal = calculatedItems.reduce((sum, item) => sum + item.amount, 0)
    const discountAmount = (subtotal * discount) / 100
    const taxableAmount = subtotal - discountAmount
    const gstAmount = (taxableAmount * gstRate) / 100
    const cgst = gstAmount / 2
    const sgst = gstAmount / 2
    const total = taxableAmount + gstAmount

    const estimate = {
      jobId,
      jobNo: job.job_no,
      vehicleNo: job.vehicle_no,
      customer: job.customers,
      items: calculatedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      taxableAmount: parseFloat(taxableAmount.toFixed(2)),
      gstRate: parseFloat(gstRate.toFixed(2)),
      gstAmount: parseFloat(gstAmount.toFixed(2)),
      cgst: parseFloat(cgst.toFixed(2)),
      sgst: parseFloat(sgst.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      notes,
      generatedAt: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from('customer_jobs')
      .update({
        estimate_data: estimate,
        status: 'estimate',
        total_amount: total,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({
        success: true,
        data: estimate,
        message: 'Job estimate generated successfully',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error generating job estimate:', error)
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