export default function TTTLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex-col items-center text-center justify-center h-full">
			{children}
		</section>
	);
}