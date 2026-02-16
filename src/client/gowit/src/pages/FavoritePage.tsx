export default function FavoritePage() {
  const data = [
    // {
    //   title: "Title",
    //   description:
    //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
    //   poster_url:
    //     "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB1tnFQzWr9K8CaNrKDfZpX9CNbOx3pZf-01gJ7rILOwfK-uDSEMUPVL5ikUq1DFDMCS0JXTaiR6OSbUx28onsNHtS3lRxOMsCcsec05G4F1VQQV_jZcLeZr6OoJGCRpgLlRRuAlubTfR8/s1600/poster+film+terbaik+sicario+-+namafilm.jp",
    //   rating: 9.1,
    //   year: 2025,
    // },
  ];

  return (
    <div className="bg-[#0F1115] overflow-hidden ">
      {data.length > 0 ? (
        ""
      ) : (
        <div className="min-h-screen flex justify-center items-center text-[#F5F2F2]">
          <h1>aa</h1>
        </div>
      )}
    </div>
  );
}
