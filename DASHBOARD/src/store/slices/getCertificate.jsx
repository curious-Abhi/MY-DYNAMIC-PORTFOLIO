import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCertificates } from "./certificateSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";


const handleDeleteCertificate = (id) => {
  setAppId(id);
  dispatch(deleteCertificate(id));
};

const handleAddButtonClick = () => {
  navigateTo("/add-certificates");
};


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
    <Card>
    <CardHeader className="px-7">
      <CardTitle>
        Certifications
        <span className="ml-2">
          <Button onClick={handleAddButtonClick}>Add</Button>
        </span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">
              Image
            </TableHead>
            <TableHead className="hidden md:table-cell">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates && certificates.length > 0 ? (
            certificates.map((element) => (
              <TableRow className="bg-accent" key={element.id}>
                <TableCell>
                  <div className="font-medium">{element.name}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Avatar
                    className="h-16 w-16"
                    src={element.img_url}
                    alt={element.name}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="text-3xl overflow-y-hidden">
                You have not added any certificates.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
  );
};

export default CertificatesComponent;
