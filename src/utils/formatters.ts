export const formatRupiah = (amount: number): string => {
    const roundedAmount = Math.floor(amount)
    return roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export const formatDisplayDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
}
