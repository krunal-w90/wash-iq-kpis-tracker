import DataTable from "@/components/DataTable";
import PageContent from "@/components/layout/PageContent";
import PageNavbar, { PageNavbarLeftContent, PageNavbarRightContent } from "@/components/layout/PageNavbar";
import DateFilter from "@/shared/DateFilter";
import Filters from "@/shared/Filters";

export default function Home() {
  return (
    <main className="flex flex-col h-screen overflow-hidden">
      <PageNavbar>
        <PageNavbarLeftContent>
          <p className="text-xl font-semibold">Wash IQ KPIs Tracker</p>
        </PageNavbarLeftContent>
        <PageNavbarRightContent>
          <Filters />
          <DateFilter />
        </PageNavbarRightContent>
      </PageNavbar>
      <PageContent>
        <DataTable />
      </PageContent>
    </main>
  );
}
