import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface CalculateGSTRequest {
  amount: number
  gstRate: number
  discount?: number
  isInclusive?: boolean
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { amount, gstRate, discount = 0, isInclusive = false }: CalculateGSTRequest =
      await req.json()

    if (!amount || amount <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    if (!gstRate || gstRate < 0) {
      throw new Error('GST rate must be provided and non-negative')
    }

    let subtotal = amount
    let discountAmount = 0
    let gstAmount = 0
    let total = 0

    if (isInclusive) {
      total = amount
      const gstMultiplier = 1 + gstRate / 100
      subtotal = amount / gstMultiplier
      gstAmount = amount - subtotal

      if (discount > 0) {
        discountAmount = (subtotal * discount) / 100
        subtotal = subtotal - discountAmount
        gstAmount = (subtotal * gstRate) / 100
        total = subtotal + gstAmount
      }
    } else {
      if (discount > 0) {
        discountAmount = (amount * discount) / 100
        subtotal = amount - discountAmount
      }
      gstAmount = (subtotal * gstRate) / 100
      total = subtotal + gstAmount
    }

    const cgst = gstAmount / 2
    const sgst = gstAmount / 2
    const igst = gstAmount

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          originalAmount: parseFloat(amount.toFixed(2)),
          discount: parseFloat(discount.toFixed(2)),
          discountAmount: parseFloat(discountAmount.toFixed(2)),
          subtotal: parseFloat(subtotal.toFixed(2)),
          gstRate: parseFloat(gstRate.toFixed(2)),
          gstAmount: parseFloat(gstAmount.toFixed(2)),
          cgst: parseFloat(cgst.toFixed(2)),
          sgst: parseFloat(sgst.toFixed(2)),
          igst: parseFloat(igst.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
          isInclusive,
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
    console.error('Error calculating GST:', error)
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