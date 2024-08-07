import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCertificates } from "../store/slices/certificateSlice";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const CertificatesComponent = () => {
  const dispatch = useDispatch();
  const certificates = useSelector((state) => state.certificates.certificates);
  const loading = useSelector((state) => state.certificates.loading);
  const error = useSelector((state) => state.certificates.error);

  useEffect(() => {
    dispatch(getAllCertificates());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <h1 className="text-tubeLight-effect text-[2rem] sm:text-[2.75rem] md:text-[3rem] lg:text-[3.8rem] tracking-[15px] dancing_text mx-auto w-fit">
        MY Certificates
    </h1>
    <Carousel className="my-8">
        <CarouselContent className="flex space-x-4">
            {certificates.map((certificate) => (
                <CarouselItem key={certificate.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <img src={certificate.img_url} alt={certificate.name} className="w-full h-full object-cover" />
                        <div className="p-4">
                        <h2 className="text-xl font-bold mb-2 text-black">{certificate.name}</h2> 
                        <p className="text-gray-700">Organization:{certificate.organization_name}</p> 
                        </div>
                    </div>
                </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg" />
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg" />
    </Carousel>
</>
  );
};

export default CertificatesComponent;
