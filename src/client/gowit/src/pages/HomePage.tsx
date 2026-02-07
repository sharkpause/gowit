import Aurora from "../components/Aurora";

export default function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-black">
        <Aurora
          colorStops={["#7cff67", "#B19EEF", "#5227FF"]}
          blend={0.5}
          amplitude={1.0}
          speed={1}
        />
      </div>
    </>
  );
}
