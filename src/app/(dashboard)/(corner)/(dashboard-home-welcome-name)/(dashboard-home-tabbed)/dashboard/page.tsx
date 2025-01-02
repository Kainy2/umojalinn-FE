import CustomCardHolder from "@/components/custom/card/Holder";
import JobCard from "@/components/custom/card/Job";

const DashboardPage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 justify-stretch mt-4">
      {new Array(4).fill("").map((_, i) => (
        <CustomCardHolder count={1} key={i} title="try">
          <JobCard
            name="My Agbada"
            progress={{
              value: 2,
              total: 4,
            }}
            img="/img/webp/buyer-sm.webp"
            dueDate={new Date(new Date().setDate(15))}
          />
        </CustomCardHolder>
      ))}
    </div>
  );
};
export default DashboardPage;
