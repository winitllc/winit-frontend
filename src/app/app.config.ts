
export const AppConfig = {
  cache: {
      keys: {
          profile: 'profile',
          currentProduct: 'currentProduct',
          dangerousIngredients: 'dangerousIngredients',
          oauthTokens: 'authTokens',
          iamCredentials: 'iamCredentials',
          spoonacularAPIKey: 'spoonacularAPIKey'
      },
      prefix: 'wii15'
  },
  auth: {
    scopes: {
      appUser: 'openid'
    }
  },
  socialMediaSupport: [
    'facebook',
    'instagram',
    'twitter',
    'whatsapp'
  ],
  controlMessages: {
    noProduct: 'no product found'
  },
  inAppPurchases: [
    'one_dollar_points'
  ],
  pointAwards: {
    addProduct: [0, 40, 80, 140],
    updateSection: 40,
    scan: 3,
    search: 1,
    shareOnSocialMedia: 50,
    inAppPurchase: {
      oneDollar: 900,
      fiveDollars: 4650,
      tenDollars: 9550
    }
  },
  categories: {
    mainCategories: [
      {
        left: {
          searchName: 'Cheese',
          displayName: 'Cheeses'
        },
        right: {
          searchName: 'Chicken',
          displayName: 'Chicken'
        }
      },
      {
        left: {
          searchName: 'Pizza',
          displayName: 'Pizza'
        },
        right:{
          searchName: 'Pasta',
          displayName: 'Pasta'
        }
      },
      {
        left: {
          searchName: 'Cereal',
          displayName: 'Cereal'
        },
        right:{
          searchName: 'Bread',
          displayName: 'Bread'
        }
      },
      {
        left: {
          searchName: 'Yogurt',
          displayName: 'Yogurt'
        },
        right:{
          searchName: 'Plant Based',
          displayName: 'Plant Based'
        }
      },
      {
        left: {
          searchName: 'Vegetable',
          displayName: 'Vegetables'
        },
        right:{
          searchName: 'Vegan',
          displayName: 'Vegan'
        }
      },
      {
        left: {
          searchName: 'Granola',
          displayName: 'Granola'
        },
        right:{
          searchName: 'Dairy',
          displayName: 'Dairy'
        }
      },
      {
        left: {
          searchName: 'Organic',
          displayName: 'Organic'
        },
        right: {
          searchName: 'Fruit',
          displayName: 'Fruit'
        }
      },
      {
        left: {
          searchName: 'Beverage',
          displayName: 'Beverages'
        },
        right: {
          searchName: 'Juice',
          displayName: 'Juices'
        }
      },
      {
        left: {
          searchName: 'Noodle',
          displayName: 'Noodles'
        },
        right:{
          searchName: 'Instant',
          displayName: 'Instant Foods'
        }
      },
      {
        left: {
          searchName: 'Frozen',
          displayName: 'Frozen Foods'
        },
        right:{
          searchName: 'Breakfast',
          displayName: 'Breakfast Foods'
        }
      },
      {
        left: {
          searchName: 'Sauce',
          displayName: 'Sauces'
        },
        right: {
          searchName: 'Chocolate',
          displayName: 'Chocolates'
        }
      },
      {
        left: {
          searchName: 'Snack',
          displayName: 'Snacks'
        },
        right: {
          searchName: 'Sweet',
          displayName: 'Sweets'
        }
      },
      {
        left: {
          searchName: 'Cookie',
          displayName: 'Cookis'
        },
        right: {
          searchName: 'Candy',
          displayName: 'Candy'
        }
      }
    ]
  },
  emptySpoonacularProduct: {
    id: -1,
    type: 'spoonacular',
    title: "",
    breadcrumbs: [
        "N/A"
    ],
    images: [],
    badges: [],
    important_badges: [],
    ingredientCount: 0.0,
    generatedText: null,
    ingredientList: "",
    ingredients: [],
    likes: 0.0,
    number_of_servings: null,
    nutrition: {
        calories: 0,
        carbs: "0g",
        fat: "0g",
        protein: "0g"
    },
    price: 0.0,
    serving_size: "",
    spoonacular_score: 0.0
  },
  emptyWuzinitProduct: {
    code: '',
    type: 'wuzinit',
    productName: '',
    breadcrumbs: [
        'N/A'
    ],
    images: {},
    badges: [],
    important_badges: [],
    ingredientsText: '',
    ingredientsList: [],
    tracesList: [],
    containsList: [],
    nutrition: {
        calories: 0,
        carbs: '0g',
        fat: '0g',
        protein: '0g'
    }
  }
};
