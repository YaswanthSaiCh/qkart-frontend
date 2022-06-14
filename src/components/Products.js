import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";
import "./Products.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const loggedIn = window.localStorage.getItem("username");
  const token = window.localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    products: [],
    loading: false,
    cartItems: [],
  });
  const [debounceTimeout, setDebounceTimeout] = useState(
    setTimeout(() => {}, 500)
  );
  const [cartLoad, setCartLoad] = useState(false);
  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */

  useEffect(() => {
    performAPICall();
  }, []);

  useEffect(() => {
    fetchCart(token);
  }, [cartLoad]);

  const performAPICall = async () => {
    setState((preState) => ({
      ...preState,
      loading: true,
    }));
    await axios
      .get(`${config.endpoint}/products`)
      .then((response) => {
        setState((preState) => ({
          ...preState,
          products: response.data,
          loading: false,
        }));
        setCartLoad(true);
      })
      .catch(() => {
        enqueueSnackbar(
          "Something went wrong. Check the backend console for more details",
          { variant: "error" }
        );
        setState((preState) => ({
          ...preState,
          loading: false,
        }));
      });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */

  const performSearch = async (text) => {
    await axios
      .get(`${config.endpoint}/products/search?value=${text}`)
      .then((response) => {
        setState((preState) => ({
          ...preState,
          products: response.data,
        }));
      })
      .catch((error) => {
        if (error.response !== undefined && error.response.status === 404) {
          setState((preState) => ({
            ...preState,
            products: [],
          }));
          enqueueSnackbar("No products found", { variant: "error" });
        } else {
          enqueueSnackbar(
            "Something went wrong. Check the backend console for more details",
            { variant: "error" }
          );
        }
      });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

  const handleSubmit = (event) => {
    debounceSearch(event, debounceTimeout);
  };

  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout);
    setDebounceTimeout(
      setTimeout(() => {
        performSearch(event.target.value);
      }, 500)
    );
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (state.products.length !== 0) {
        setState((preState) => ({
          ...preState,
          cartItems: generateCartItemsFrom(response.data, state.products),
        }));
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    var isIn = false;
    items.forEach((item) => {
      if (item.productId === productId) isIn = true;
    });
    return isIn;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */

  const handleCart = (productId) => {
    // console.log('clicked')
    addToCart(token, state.cartItems, state.products, productId, 1);
  };

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (token) {
      // console.log('clicked')
      if (!isItemInCart(items, productId)) {
        console.log("clicked", productId);
        addInCart(productId, qty);
      } else {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item",
          { variant: "warning" }
        );
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
  };

  const handleQuantity = (productId, qty) => {
    addInCart(productId, qty);
  };

  const addInCart = async (productId, qty) => {
    // const url=`${config.endpoint}/cart`;
    // await axios.post(url,{"productId":"BW0jAAeDJmlZCF8i","qty":1},{ headers: {"Authorization" : `Bearer ${token}`} })
    await axios
      .post(
        `${config.endpoint}/cart`,
        { productId: productId, qty: qty },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log("clicked");
        setState((preState) => ({
          ...preState,
          cartItems: generateCartItemsFrom(response.data, state.products),
        }));
      })
      .catch((error) => {
        enqueueSnackbar("Something went wrong", { variant: "error" });
      });
  };

  return (
    <div>
      <Header loggedIn={loggedIn} hasHiddenAuthButtons>
        <Box sx={{ width: "45vw" }}>
          <TextField
            className="search-desktop"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            onChange={handleSubmit}
            placeholder="Search for items/categories."
            name="search"
          />
        </Box>
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        onChange={handleSubmit}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container spacing={2}>
        <Grid item xs={12} md={loggedIn !== null ? 9 : 12}>
          <Grid container spacing={2}>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>
            {state.loading ? (
              <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                mt={6}
                mb={6}
              >
                <Grid item>
                  <CircularProgress
                    size={40}
                    color="success"
                    className="loading"
                  />
                </Grid>
                <Grid item>
                  <div>Loading Products...</div>
                </Grid>
              </Grid>
            ) : (
              <>
                {state.products.length === 0 ? (
                  <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    mt={6}
                    mb={6}
                  >
                    <Grid item>
                      <SentimentDissatisfied size={40} className="loading" />
                    </Grid>
                    <Grid item>
                      <div>No products found</div>
                    </Grid>
                  </Grid>
                ) : (
                  <>
                    {state.products.map((product) => (
                      <Grid item xs={12} sm={6} md={3} key={product._id}>
                        <ProductCard
                          product={product}
                          handleAddToCart={(event) => handleCart(product._id)}
                        />
                      </Grid>
                    ))}
                  </>
                )}
              </>
            )}
          </Grid>
        </Grid>
        {loggedIn !== null && (
          <Grid item xs={12} md={3}>
            <Cart
              products={state.products}
              items={state.cartItems}
              handleQuantity={handleQuantity}
            />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
