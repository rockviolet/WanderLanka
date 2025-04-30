import MainNavbar from "@/app/(components)/MainNavbar";
import TourGuideProfile from "@/app/(components)/TourGuideProfile";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const fetchData = async (id: string) => {
  try {
    return await prisma.tourGuide.findUnique({
      where: { id },
      include: {
        reviews: {
          include: {
            client: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const TourGuideProfilePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const guide = await fetchData(id);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 relative">
      {/* Enhanced Background with Blur and Glass Effect */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Background Image with Stronger Blur */}
        <div
          className="w-full h-full bg-cover bg-center blur-sm scale-105"
          style={{
            backgroundImage: "url('/assets/bg.png')",
            filter: "blur(8px) brightness(0.8)",
          }}
        />

        {/* Glass Morphism Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-md"></div>
      </div>

      <div className="relative z-10">
        <MainNavbar />
      </div>
      <TourGuideProfile guide={guide} />
    </div>
  );
};

export default TourGuideProfilePage;
