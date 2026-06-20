export function formatCurrency(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(price);
}

export function formatDate(value?: { toDate: () => Date }) {
  if (!value) return "Recently";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(value.toDate());
}

export function getWhatsAppUrl(phone: string, title: string) {
  const digits = phone.replace(/\D/g, "");
  const withoutLeadingZeros = digits.replace(/^0+/, "");
  const withCountryCode =
    withoutLeadingZeros.length === 10
      ? `91${withoutLeadingZeros}`
      : withoutLeadingZeros;
  const message = encodeURIComponent(
    `Hi, I found your "${title}" listing on ReCircuit. Is it still available?`
  );

  return `https://wa.me/${withCountryCode}?text=${message}`;
}
