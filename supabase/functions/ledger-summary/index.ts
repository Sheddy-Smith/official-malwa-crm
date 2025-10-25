import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    const { entityType, entityId, startDate, endDate } = await req.json()

    if (!entityType || !entityId) {
      throw new Error('Entity type and ID are required')
    }

    let tableName = ''
    let entityTable = ''

    switch (entityType) {
      case 'customer':
        tableName = 'customer_ledger_entries'
        entityTable = 'customers'
        break
      case 'vendor':
        tableName = 'vendor_ledger_entries'
        entityTable = 'vendors'
        break
      case 'labour':
        tableName = 'labour_ledger_entries'
        entityTable = 'labour'
        break
      case 'supplier':
        tableName = 'supplier_ledger_entries'
        entityTable = 'suppliers'
        break
      default:
        throw new Error('Invalid entity type')
    }

    let query = supabase
      .from(tableName)
      .select('*')
      .eq(`${entityType}_id`, entityId)
      .order('entry_date', { ascending: true })
      .order('created_at', { ascending: true })

    if (startDate) {
      query = query.gte('entry_date', startDate)
    }

    if (endDate) {
      query = query.lte('entry_date', endDate)
    }

    const { data: entries, error: entriesError } = await query

    if (entriesError) throw entriesError

    const { data: entity, error: entityError } = await supabase
      .from(entityTable)
      .select('*')
      .eq('id', entityId)
      .single()

    if (entityError) throw entityError

    let runningBalance = entity.opening_balance || 0

    const entriesWithBalance = entries.map((entry) => {
      runningBalance = runningBalance + (entry.debit || 0) - (entry.credit || 0)
      return {
        ...entry,
        balance: parseFloat(runningBalance.toFixed(2)),
      }
    })

    const totalDebit = entries.reduce((sum, e) => sum + (e.debit || 0), 0)
    const totalCredit = entries.reduce((sum, e) => sum + (e.credit || 0), 0)

    const summary = {
      entity: {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        openingBalance: entity.opening_balance || 0,
        currentBalance: entity.current_balance || 0,
      },
      period: {
        startDate: startDate || entries[0]?.entry_date || null,
        endDate: endDate || entries[entries.length - 1]?.entry_date || null,
      },
      totals: {
        debit: parseFloat(totalDebit.toFixed(2)),
        credit: parseFloat(totalCredit.toFixed(2)),
        net: parseFloat((totalDebit - totalCredit).toFixed(2)),
      },
      entries: entriesWithBalance,
      transactionCount: entries.length,
      generatedAt: new Date().toISOString(),
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: summary,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error generating ledger summary:', error)
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