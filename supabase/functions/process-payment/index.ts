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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const {
      customerId,
      amount,
      paymentMode,
      reference,
      notes,
      invoiceAllocations,
    } = await req.json()

    if (!customerId || !amount || amount <= 0) {
      throw new Error('Customer ID and valid amount are required')
    }

    const receiptNo = `RCP-${Date.now()}`
    const receiptDate = new Date().toISOString().split('T')[0]

    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .insert([
        {
          receipt_no: receiptNo,
          customer_id: customerId,
          receipt_date: receiptDate,
          amount: parseFloat(amount),
          payment_mode: paymentMode || 'cash',
          reference: reference || null,
          notes: notes || null,
        },
      ])
      .select()
      .single()

    if (receiptError) throw receiptError

    if (invoiceAllocations && invoiceAllocations.length > 0) {
      let remainingAmount = parseFloat(amount)

      for (const allocation of invoiceAllocations) {
        if (remainingAmount <= 0) break

        const allocatedAmount = Math.min(remainingAmount, allocation.amount)

        const { error: updateError } = await supabase
          .from('invoices')
          .update({
            paid_amount: supabase.raw(`paid_amount + ${allocatedAmount}`),
            payment_status: supabase.raw(
              `CASE WHEN (paid_amount + ${allocatedAmount}) >= total_amount THEN 'paid' ELSE 'partial' END`
            ),
          })
          .eq('id', allocation.invoiceId)

        if (updateError) throw updateError

        remainingAmount -= allocatedAmount
      }
    }

    const { data: updatedCustomer, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single()

    if (customerError) throw customerError

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          receipt,
          customer: updatedCustomer,
          allocations: invoiceAllocations || [],
        },
        message: 'Payment processed successfully',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error processing payment:', error)
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