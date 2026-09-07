export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}