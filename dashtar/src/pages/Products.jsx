import React, { useContext, useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Input,
  Button,
  Card,
  CardBody,
  Pagination,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

//internal import

import useAsync from "@/hooks/useAsync";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import NotFound from "@/components/table/NotFound";
import ProductServices from "@/services/ProductServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import ProductTable from "@/components/product/ProductTable";
import useProductFilter from "@/hooks/useProductFilter";
import TableLoading from "@/components/preloader/TableLoading";
import SelectCategory from "@/components/form/selectOption/SelectCategory";
import AnimatedContent from "@/components/common/AnimatedContent";
import AddProductPopup from "@/components/drawer/AddDishPopup";

const Products = () => {
  const { serviceId } = useToggleDrawer();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { t } = useTranslation();
  const {
    toggleDrawer,
    lang,
    currentPage,
    handleChangePage,
    searchText,
    category,
    setCategory,
    searchRef,
    handleSubmitForAll,
    sortedField,
    setSortedField,
    limitData,
    setIsUpdate,
  } = useContext(SidebarContext);

  const { data, loading, error } = useAsync(() =>
    ProductServices.getAllDishes({
      page: currentPage,
      limit: limitData,
      category: category,
      title: searchText,
      price: sortedField,
    })
  );

  console.log("product page ------->", data);

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setIsPopupOpen(true);
  };

  const handleAddNew = () => {
    setCurrentProduct(null);
    setIsEditing(false);
    setIsPopupOpen(true);
  };

  const handleSuccess = (responseData, success) => {
    if (success) {
      // Trigger a refetch by updating isUpdate
      setIsUpdate(true);
    }
    setIsPopupOpen(false);
    setCurrentProduct(null);
    setIsEditing(false);
  };

  // react hooks
  const [isCheck, setIsCheck] = useState([]);

  // handle reset field
  const handleResetField = () => {
    setCategory("");
    setSortedField("");
    searchRef.current.value = "";
    handleSubmitForAll({ preventDefault: () => { } });
  };

  // console.log('productss',products)
  const { serviceData } = useProductFilter(data?.products);

  return (
    <>
      <PageTitle>{t("Menu")}</PageTitle>

      {/* <MainDrawer>
        <ProductDrawer id={serviceId} />
      </MainDrawer> */}
      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody className="">
            <form
              onSubmit={handleSubmitForAll}
              className="py-3 md:pb-0 grid gap-4 lg:gap-6 xl:gap-6 xl:flex"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <Button
                    onClick={() => setIsPopupOpen(true)}
                    className="w-full rounded-md h-12"
                  >
                    <span className="mr-2">
                      <FiPlus />
                    </span>
                    {t("AddProduct")}
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardBody>
            <form
              onSubmit={handleSubmitForAll}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={searchRef}
                  type="search"
                  name="search"
                  placeholder="Search Product"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-5 mr-1"
                ></button>
              </div>

              {/* <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <SelectCategory setCategory={setCategory} lang={lang} />
              </div> */}

              <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <div className="w-full mx-1">
                  <Button type="submit" className="h-12 w-full bg-emerald-700">
                    Filter
                  </Button>
                </div>

                <div className="w-full mx-1">
                  <Button
                    layout="outline"
                    onClick={handleResetField}
                    type="reset"
                    className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700"
                  >
                    <span className="text-black dark:text-gray-200">Reset</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>

      <AddProductPopup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          setCurrentProduct(null);
          setIsEditing(false);
        }}
        onSuccess={handleSuccess}
        addProduct={
          isEditing ? ProductServices.updateDish : ProductServices.addDish
        }
        productData={currentProduct}
        isEditing={isEditing}
      />

      {loading ? (
        <TableLoading row={12} col={7} width={160} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{t("ProductNameTbl")}</TableCell>
                <TableCell>{t("Cuisine")}</TableCell>

                <TableCell className="text-center">
                  {t("Active/Inactive")}
                </TableCell>
                <TableCell className="text-right">{t("ActionsTbl")}</TableCell>
              </tr>
            </TableHeader>
            <ProductTable
              lang={lang}
              isCheck={isCheck}
              products={data?.dishes}
              setIsCheck={setIsCheck}
              onEdit={handleEdit}
            />
          </Table>
          <TableFooter>
                {/* <Pagination
              totalResults={data?.totalDoc}
              resultsPerPage={limitData}
              onChange={handleChangePage}
              label="Product Page Navigation"
            /> */}
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Product" />
      )}
    </>
  );
};

export default Products;
