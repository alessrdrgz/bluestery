export function formatDate({ date }: { date: Date }) {
	const { locale, timeZone } = Intl.DateTimeFormat().resolvedOptions();
	const options: Intl.DateTimeFormatOptions = {
		day: '2-digit',
		month: '2-digit',
		hour12: false,
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		timeZone
	};

	const formatter = new Intl.DateTimeFormat(locale, options);
	const formattedDate = formatter.format(date);
	const today = new Date().toDateString() == date.toDateString();
	return today ? `Hoy, ${formattedDate.split(',')[1]}` : formattedDate;
}
