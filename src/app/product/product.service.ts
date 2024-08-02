import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpOptions, HttpResponse } from '@capacitor/core';
import { model } from 'wuzinit-common';
import { EnvironmentConfig } from '../environment.config';
import { AuthState } from '../util/auth.state';
import { AppConfig } from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private authState: AuthState
  ) { }

  // public async updateWIIProduct(productUpdate: model.WuzinitProduct): Promise<number> {

  // }

  public async addNewProductUpdate(product: OpenFoodFactsProductUpdate): Promise<OpenFoodFactsProductUpdate> {
    const postProductUpdate = `${EnvironmentConfig.api.openFoodFactsProducts.testUrl}${EnvironmentConfig.api.openFoodFactsProducts.addProductUpdate}`;
    // const postProductUpdate = `${EnvironmentConfig.api.openFoodFactsProducts.baseUrl}${EnvironmentConfig.api.openFoodFactsProducts.addProductUpdate}`;
    console.log(`ProductService.addNewProductUpdate: adding new product: ${JSON.stringify(product)}`);
    console.log(`ProductService.addNewProductUpdate: url: ${postProductUpdate}`);
    try {
      const requestOptions: HttpOptions = {
        url: postProductUpdate,
        headers: {
          'User-Agent': EnvironmentConfig.api.openFoodFactsProducts.headerUserAgent
        },
        params: {
          code: product.code,
          product_name_en: product.product_name_en,
          ingredients_text: product.ingredients_text,
          nutrition_data: product.nutrition_data,
          image_url: product.image_url,
          image_ingredients_url: product.image_ingredients_url,
          image_front_url: product.image_front_url,
          image_nutrition_url: product.image_nutrition_url,
          brands: product.brands
        }
      };
      const result: HttpResponse = await CapacitorHttp.post(requestOptions);
      console.log(`ProductService.addNewProductUpdate: result from open food facts: ${JSON.stringify(result)}`);
      console.log(`ProductService.addNewProductUpdate: product object: ${JSON.stringify(product)}`);
      return product;
    } catch (error) {
      console.error(`ProductService.addNewProductUpdate: Error getting by id ${JSON.stringify(product)}`);
      console.error(`ProductService.addNewProductUpdate: Error: ${JSON.stringify(error)}`);
      return JSON.parse(JSON.stringify(AppConfig.emptyWuzinitProduct));
    }
  }

  public async getProductByBarcode(barcode: string): Promise<OpenFoodFactsProduct> {
    const getProductByBarcodeURL = `${EnvironmentConfig.api.openFoodFactsProducts.baseUrl}${EnvironmentConfig.api.openFoodFactsProducts.getByCode}${barcode}.json`;
    console.log(`ProductService.getProductByBarcode: requesting product by barcode: ${barcode}`);
    console.log(`ProductService.getProductByBarcode: url: ${getProductByBarcodeURL}`);
    try {
      // const apiKey: string = this.authState.getSpoonacularAPIKey();
      const requestOptions = {
        url: getProductByBarcodeURL,
        headers: {
          'User-Agent': EnvironmentConfig.api.openFoodFactsProducts.headerUserAgent
        },
        params: {
          // apiKey
        }
      }
      const result: HttpResponse = await CapacitorHttp.get(requestOptions);
      console.log(`ProductService.getProductByBarcode: result from OpenFoodFacts: ${JSON.stringify(result)}`);
      const product: OpenFoodFactsProduct = result.data?.product;
      console.log(`ProductService.getProductByBarcode: product object: ${JSON.stringify(product)}`);
      return product;
    } catch (error) {
      console.error(`ProductService.getProductByBarcode: Error getting by barcode ${barcode}`);
      console.error(`ProductService.getProductByBarcode: Error: ${JSON.stringify(error)}`);
      return JSON.parse(JSON.stringify(AppConfig.emptyWuzinitProduct));
    }
  }

  public async searchProductByCategory(category: string, nextPage?: string): Promise<any> {
    const getProductByBarcodeURL = `${EnvironmentConfig.api.openFoodFactsProducts.baseUrl}${EnvironmentConfig.api.openFoodFactsProducts.searchByTag}`;
    console.log(`ProductService.searchProductByCategory: searching by category: ${category}`);
    console.log(`ProductService.searchProductByCategory: url: ${getProductByBarcodeURL}`);
    try {
      // const apiKey: string = this.authState.getSpoonacularAPIKey();
      const requestOptions: any = {
        url: getProductByBarcodeURL,
        headers: {
          'User-Agent': EnvironmentConfig.api.openFoodFactsProducts.headerUserAgent,
          'Access-Control-Allow-Origin': '*'
        },
        params: {
          action: 'process',
          json: 'true',
          tagtype_0: 'categories',
          tag_contains_0: 'contains',
          tag_0: category
        }
      };
      requestOptions.params.page = nextPage || undefined;
      console.log(`ProductService.searchProductByCategory: request options: ${JSON.stringify(requestOptions)}`);
      const result: HttpResponse = await CapacitorHttp.get(requestOptions);
      console.log(`ProductService.searchProductByCategory: result from OpenFoodFacts: ${JSON.stringify(result)}`);
      console.log(`ProductService.searchProductByCategory: result fields from OpenFoodFacts: ${Object.keys(result.data)}`);
      console.log(`ProductService.searchProductByCategory: page field from OpenFoodFacts: ${result.data.page}`);
      console.log(`ProductService.searchProductByCategory: result page_size from OpenFoodFacts: ${result.data.page_size}`);
      console.log(`ProductService.searchProductByCategory: result page_count from OpenFoodFacts: ${result.data.page_count}`);
      console.log(`ProductService.searchProductByCategory: result count from OpenFoodFacts: ${result.data.count}`);
      console.log(`ProductService.searchProductByCategory: skip field from OpenFoodFacts: ${result.data.skip}`);
      const products: OpenFoodFactsProduct[] = result.data?.products;

      const product_name_en_list: string[] = [];
      const brands_list: string[] = [];
      products.forEach((product) => {
        product_name_en_list.push(product.product_name_en);
        brands_list.push(product.brands);
      });
      console.log(`ProductService.searchProductByCategory: product product_name_en_list: ${JSON.stringify(product_name_en_list)}`);
      console.log(`ProductService.searchProductByCategory: product brands_list: ${JSON.stringify(brands_list)}`);
      return {
        products,
        page: result.data.page,
        page_size: result.data.page_size,
        page_count: result.data.page_count,
        count: result.data.count,
        skip: result.data.skip
      };
    } catch (error) {
      console.error(`ProductService.searchProductByCategory: Error getting by category ${category}`);
      console.error(`ProductService.searchProductByCategory: Error: ${JSON.stringify(error)}`);
      return JSON.parse(JSON.stringify(AppConfig.emptyWuzinitProduct));
    }
  }
}

export interface OpenFoodFactsProductUpdate {
  code: string;
  product_name_en: string;
  ingredients_text: string;
  nutrition_data: string;
  image_url: string;
  image_ingredients_url: string;
  image_front_url: string;
  image_nutrition_url: string;
  brands: string;
  labels?: string;
}

export interface OpenFoodFactsProduct {
  last_edit_dates_tags: string[];
  pnns_groups_1: string;
  nova_group_debug: string;
  ingredients_n: number;
  completeness: number;
  image_thumb_url: string;
  additives_n: number;
  packaging: string;
  ingredients_from_palm_oil_n: number;
  codes_tags: string[];
  data_quality_errors_tags: string[];
  ingredients_that_may_be_from_palm_oil_n: number;
  categories_hierarchy: string[];
  serving_quantity: string;
  traces_from_ingredients: string;
  selected_images: OpenFoodFactsImages;
  image_ingredients_thumb_url: string;
  image_nutrition_small_url: string;
  vitamins_tags: string[];
  labels_prev_hierarchy: string[];
  ingredients_text_with_allergens_en: string;
  serving_size_debug_tags: string[];
  brands_tags: string[];
  additives_old_n: number;
  lang: string;
  other_nutritional_substances_tags: string[];
  editors: string[];
  ingredients_text_en: string;
  languages: any;
  nutriscore_points: any;
  traces_debug_tags: string[];
  quantity_debug_tags: string[];
  product_name_en_debug_tags: string[];
  cities_tags: string[];
  new_additives_n: number;
  ingredients_original_tags: string[];
  nutriments: any;
  minerals_tags: string[];
  purchase_places: string;
  nutrition_data_prepared: string;
  categories_lc: string;
  countries_tags: string[];
  nutrition_data_per: string;
  expiration_date_debug_tags: string;
  completed_t: number;
  purchase_places_tags: string;
  nutrition_data: string;
  generic_name_en_debug_tags: string;
  emb_codes_tags: string;
  nucleotides_tags: string;
  allergens_tags: string;
  nutrition_grades_tags: string[];
  labels_prev_tags: string;
  pnns_groups_2_tags: string[];
  complete: number;
  image_url: string;
  additives_old_tags: string[];
  entry_dates_tags: string[];
  informers_tags: string[];
  countries_hierarchy: string[];
  purchase_places_debug_tags: string;
  manufacturing_places: string;
  image_nutrition_url: string;
  last_image_t: number;
  nutrition_grade_fr: string;
  nutriscore_grade: string;
  nutrition_grades: string;
  amino_acids_tags: string[];
  ingredients_text_en_debug_tags: string[];
  additives_original_tags: string[];
  image_ingredients_small_url: string;
  nutrition_data_prepared_per_debug_tags: string[];
  ingredients_debug: string[];
  link_debug_tags: string[];
  emb_codes: string;
  product_name_en: string;
  ingredients_from_palm_oil_tags: string[];
  allergens_debug_tags: string[];
  additives_tags: string[];
  ingredients_tags: string[];
  origins_debug_tags: string[];
  data_quality_info_tags: string[];
  image_nutrition_thumb_url: string;
  stores_debug_tags: string[];
  ingredients_that_may_be_from_palm_oil_tags: string[];
  product_quantity: string;
  allergens: string;
  additives_prev_original_tags: string[];
  generic_name: string;
  lc: string;
  languages_tags: string[];
  image_front_small_url: string;
  labels: string;
  nova_groups_tags: string[];
  categories_tags: string[];
  ingredients: OpenFoodFactsIngredient[];
  scans_n: number;
  ingredients_n_tags: string[];
  languages_codes: any;
  nova_group: string;
  debug_param_sorted_langs: string[];
  states_tags: string[];
  popularity_tags: string[];
  traces_from_user: string;
  amino_acids_prev_tags: string[];
  nova_groups: string;
  brands_debug_tags: string[];
  checkers_tags: string[];
  vitamins_prev_tags: string[];
  traces_tags: string[];
  last_image_dates_tags: string[];
  ingredients_text_debug: string;
  _id: string;
  additives_debug_tags: string[];
  ingredients_text_with_allergens: string;
  lang_debug_tags: string[];
  _keywords: string[];
  image_small_url: string;
  interface_version_modified: string;
  unknown_nutrients_tags: string[];
  brands: string;
  origins: string;
  nutrition_data_prepared_per: string;
  labels_tags: string[];
  update_key: string;
  "fruits-vegetables-nuts_100g_estimate": number;
  data_quality_bugs_tags: string[];
  data_quality_warnings_tags: string[];
  countries_debug_tags: string[];
  ingredients_analysis_tags: string[];
  image_front_thumb_url: string;
  last_modified_by: string;
  nucleotides_prev_tags: string[];
  traces: string;
  nutriscore_score: number;
  unique_scans_n: number;
  pnns_groups_2: string;
  countries_lc: string;
  last_editor: string;
  no_nutrition_data: string;
  additives_tags_n: string;
  categories: string;
  ingredients_from_or_that_may_be_from_palm_oil_n: number;
  ingredients_hierarchy: string[];
  manufacturing_places_debug_tags: string[];
  minerals_prev_tags: string[];
  manufacturing_places_tags: string[];
  expiration_date: string;
  sortkey: number;
  serving_size: string;
  photographers_tags: string[];
  countries: string;
  nutrition_score_warning_no_fruits_vegetables_nuts: number;
  image_ingredients_url: string;
  interface_version_created: string;
  emb_codes_debug_tags: string[];
  last_modified_t: number;
  states: string;
  ingredients_text: string;
  origins_tags: string[];
  nutrient_levels_tags: string[];
  code: string;
  id: string;
  link: string;
  traces_hierarchy: string[];
  unknown_ingredients_n: number;
  data_quality_tags: string[];
  labels_lc: string;
  ingredients_ids_debug: string[];
  stores_tags: string[];
  compared_to_category: string;
  allergens_hierarchy: string[];
  max_imgid: string;
  emb_codes_20141016: string;
  misc_tags: string[];
  languages_hierarchy: string[];
  images: any;
  stores: string;
  nutrient_levels: OpenFoodFactsNutrientLevels;
  nutrition_score_beverage: number;
  correctors_tags: string[];
  rev: number;
  pnns_groups_1_tags: string[];
  labels_hierarchy: string[];
  generic_name_en: string;
  quantity: string;
  packaging_debug_tags: string[];
  image_front_url: string;
  creator: string;
  states_hierarchy: string[];
  product_name: string;
  emb_codes_orig: string;
  nutrition_data_per_debug_tags: string[];
  nutrition_score_debug: string;
  editors_tags: string[];
  allergens_from_user: string;
  packaging_tags: string[];
  created_t: number;
  allergens_from_ingredients: string;
}

export interface OpenFoodFactsImages {
  front: OpenFoodFactsImage;
  ingredients: OpenFoodFactsImage;
  nutrition: OpenFoodFactsImage;
}

export interface OpenFoodFactsImage {
  display: any;
  small: any;
  thumb: any;
}

export interface OpenFoodFactsIngredient {
  text: string;
  vegan: string;
  rank: number;
  vegetarian: string;
  id: string;
}

export interface OpenFoodFactsNutrientLevels {
  "saturated-fat": string;
  sugars: string;
  salt: string;
  fat: string;
}
