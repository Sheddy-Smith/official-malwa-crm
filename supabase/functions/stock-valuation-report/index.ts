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

    const { data: items, error } = await supabase
      .from('inventory_items')
      .select(`
        *,
        category:inventory_categories(id, name)
      `)

    if (error) throw error

    const valuationData = items.map((item) => {
      const currentStock = parseFloat(item.current_stock || 0)
      const costPrice = parseFloat(item.cost_price || 0)
      const sellingPrice = parseFloat(item.selling_price || 0)
      const reorderLevel = parseFloat(item.reorder_level || 0)

      const costValue = currentStock * costPrice
      const sellingValue = currentStock * sellingPrice
      const potentialProfit = sellingValue - costValue
      const profitMargin =
        sellingValue > 0 ? ((potentialProfit / sellingValue) * 100).toFixed(2) : 0

      const stockStatus =
        currentStock === 0
          ? 'out_of_stock'
          : currentStock <= reorderLevel
          ? 'low_stock'
          : 'in_stock'

      return {
        id: item.id,
        code: item.code,
        name: item.name,
        category: item.category?.name || 'Uncategorized',
        currentStock,
        unit: item.unit,
        costPrice,
        sellingPrice,
        costValue: parseFloat(costValue.toFixed(2)),
        sellingValue: parseFloat(sellingValue.toFixed(2)),
        potentialProfit: parseFloat(potentialProfit.toFixed(2)),
        profitMargin: parseFloat(profitMargin),
        reorderLevel,
        stockStatus,
        location: item.location,
      }
    })

    const summary = {
      totalItems: valuationData.length,
      totalCostValue: valuationData.reduce((sum, item) => sum + item.costValue, 0),
      totalSellingValue: valuationData.reduce((sum, item) => sum + item.sellingValue, 0),
      totalPotentialProfit: valuationData.reduce((sum, item) => sum + item.potentialProfit, 0),
      outOfStockCount: valuationData.filter((i) => i.stockStatus === 'out_of_stock').length,
      lowStockCount: valuationData.filter((i) => i.stockStatus === 'low_stock').length,
      inStockCount: valuationData.filter((i) => i.stockStatus === 'in_stock').length,
    }

    const categoryBreakdown = items.reduce((acc, item) => {
      const categoryName = item.category?.name || 'Uncategorized'
      if (!acc[categoryName]) {
        acc[categoryName] = {
          items: 0,
          totalValue: 0,
        }
      }
      acc[categoryName].items++
      acc[categoryName].totalValue +=
        parseFloat(item.current_stock || 0) * parseFloat(item.cost_price || 0)
      return acc
    }, {})

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          items: valuationData,
          summary,
          categoryBreakdown,
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
    console.error('Error generating stock valuation report:', error)
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