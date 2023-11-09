import ProductList from "../../components/productlist";
import { Button, List, ListItem, ListSubheader, Typography } from "@mui/joy";
import { currentTheme } from "../../theme";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchInput from "../../components/searchinput";
import { useSelector } from "react-redux";
import CategoriesImageBox from "../../components/categoriesimagebox";
import { products } from "../../data";
import AppBar from "../../components/appbar";

function Home() {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [checkedCategories, setCheckedCategories] = useState([]);

  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState([]);

  useEffect(() => {
    const cats = filteredProducts.reduce((x, y) => {
      (x[y.category.title] = x[y.category.title] || []).push(y);

      return x;
    }, {});

    setProductsByCategory(cats);
  }, [filteredProducts]);

  useEffect(() => {
    const catIds = new Set([]);
    const cats = [];
    for (let i = 0; i < products.length; i++) {
      let prod = products[i];
      if (catIds.has(prod.category._id)) continue;
      catIds.add(prod.category._id);
      cats.push(prod.category);
    }
    setCategories(cats);
  }, []);

  const orderProducts = useSelector(
    (state) => state.order.orders[state.order.activeOrder].products
  );

  const onSearch = (value) => {
    let newProds = [...products];
    if (value) {
      newProds = products.filter(
        (prod) => prod.name.toUpperCase().search(value.toUpperCase()) !== -1
      );
    }

    setFilteredProducts(newProds);
  };

  const onCategoryChange = (cat, checked) => {
    let currentChecked = [...checkedCategories];
    if (checked) {
      currentChecked.push(cat);
    } else {
      currentChecked = currentChecked.filter(
        (checkedCat) => checkedCat !== cat
      );
    }
    setCheckedCategories(currentChecked);
  };

  useEffect(() => {
    let currentProducts = [...products];
    if (checkedCategories.length) {
      currentProducts = currentProducts.filter((prod) =>
        checkedCategories.includes(prod.category.title)
      );
    }
    setFilteredProducts(currentProducts);
  }, [checkedCategories]);

  return (
    <>
      <Box sx={{ maxWidth: "100vw" }}>
        <AppBar title="Magic Merchant's demo" />
        <Box
          sx={{
            mx: "auto",
            gap: 4,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box sx={{ padding: "0px 20px 0px" }}>
            <SearchInput onSearch={onSearch} />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mx: "auto",
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <CategoriesImageBox
              data={categories}
              onCategoryChecked={onCategoryChange}
            />
          </Box>
          <Box
            sx={{
              mx: "auto",
              marginBottom: "100px",
              padding: "0px 20px 0px",
            }}
          >
            <Typography
              level="h4"
              textColor={currentTheme.colors.textPrimary}
              sx={{ marginRight: "auto" }}
            >
              Products
            </Typography>
            <List>
              {[...Object.keys(productsByCategory)].map((cat) => {
                const catProds = productsByCategory[cat];
                return (
                  <ListItem
                    key={`cats-list-${cat.title}-${Math.random() * 1000}`}
                    nested
                  >
                    <ListSubheader>{cat.toUpperCase()}</ListSubheader>
                    <ProductList data={catProds} showTitle={false} />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
      </Box>
      {Object.keys(orderProducts).length !== 0 && (
        <Box
          sx={{
            position: "fixed",
            zIndex: 100,
            display: "flex",
            maxWidth: "100vw",
          }}
        >
          <Link to={"/order-info"}>
            <Button
              sx={{
                mx: { xs: "auto", sm: "auto" },
                position: "fixed",
                bottom: 0,
                boxShadow: 15,
                backgroundColor: currentTheme.colors.secondary,
                "&:hover": {
                  backgroundColor: currentTheme.colors.secondaryLighter,
                },
                borderRadius: 0,
                width: "100%",
              }}
              size="lg"
            >
              Next
            </Button>
          </Link>
        </Box>
      )}
    </>
  );
}

export default Home;
