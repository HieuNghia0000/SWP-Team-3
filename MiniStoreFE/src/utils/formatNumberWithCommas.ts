export default function formatNumberWithCommas(number: string | number) {
  return number.toString().replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
