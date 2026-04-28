import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import StateTemplate from "@/components/StateTemplate";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";

// Helper to get data path
const getDataPath = (uf: string) => path.join(process.cwd(), "src/data/states", `${uf}.json`);

// Fetch data safely
function getStateData(uf: string) {
  try {
    const filePath = getDataPath(uf.toLowerCase());
    if (!fs.existsSync(filePath)) return null;
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading data for state ${uf}:`, error);
    return null;
  }
}

// Generate static params for existing JSON files
export async function generateStaticParams() {
  try {
    const statesDir = path.join(process.cwd(), "src/data/states");
    const files = fs.readdirSync(statesDir);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => ({
        uf: file.replace(".json", ""),
      }));
  } catch (error) {
    return [];
  }
}

// Generate dynamic SEO Metadata
export async function generateMetadata(
  { params }: { params: Promise<{ uf: string }> }
): Promise<Metadata> {
  const resolvedParams = await params;
  const data = getStateData(resolvedParams.uf);
  
  if (!data) return { title: "Estado não encontrado" };

  return {
    title: data.seo.title,
    description: data.seo.meta_description,
    keywords: data.seo.keywords,
    openGraph: {
      title: data.seo.title,
      description: data.seo.meta_description,
      type: "website",
    },
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<{ uf: string }>;
}) {
  const resolvedParams = await params;
  const data = getStateData(resolvedParams.uf);

  if (!data) {
    notFound();
  }

  // Schema.org JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": data.state_name,
    "description": data.seo.meta_description,
    "touristType": ["econômico", "família", "casal", "ecoturismo"],
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": data.map_settings.default_center.lat,
      "longitude": data.map_settings.default_center.lng
    },
    "includesAttraction": data.top_attractions.map((attr: any) => ({
      "@type": "TouristAttraction",
      "name": attr.name,
      "isAccessibleForFree": attr.is_free
    }))
  };

  return (
    <main className="min-h-screen bg-background text-foreground pt-20">
      <Navbar />
      
      {/* Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <StateTemplate data={data} />
      
      <FooterSection />
    </main>
  );
}
