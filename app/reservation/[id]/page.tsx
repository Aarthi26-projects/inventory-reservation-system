export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Reservation Page</h1>
      <p>Reservation ID: {params.id}</p>
    </div>
  );
}