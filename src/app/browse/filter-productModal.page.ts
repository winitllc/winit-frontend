import { InputCustomEvent, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  templateUrl: 'filter-productModal.page.html',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],
  selector: 'filter-product',
  styleUrls: ['filter-productModal.page.scss']
})
export class FilterProductModalComponent implements OnInit, AfterViewInit, OnDestroy {

  public searchInput: string = '';
  public currentLabelList: string[];
  @Input() labelFilters: string[] = [];
  initialLabelFilters: string[];

  constructor(
    private modalCtrl: ModalController
  ) {
    this.currentLabelList = fullLabelList;
    this.initialLabelFilters = this.labelFilters;
  }

  ngOnInit() {
    console.log(`FilterProductModalComponent.constructor: ngOnInit`);
  }

  public ngAfterViewInit(): void {
    console.log(`FilterProductModalComponent.ngAfterViewIn after view init`);
    setTimeout(() => {
      this.resetInput();
    }, 500);
    this.currentLabelList = fullLabelList;
    console.log(`FilterProductModalComponent.ngAfterViewIn this current label list: ${JSON.stringify(this.currentLabelList)}`);
  }

  public ngOnDestroy(): void {
    console.log(`FilterProductModalComponent.ngOnDestroy: destroying view`);
    this.resetInput();
  }

  cancel() {
    return this.modalCtrl.dismiss(this.initialLabelFilters, 'cancel');
  }

  filterList() {
    this.currentLabelList = fullLabelList.filter((label) => {
      const match = label.toLocaleLowerCase().match(this.searchInput.toLocaleLowerCase());
      const didMatch = match && Number(match.index) > -1;
      console.log(`FilterProductModalComponent.filterList: checking if ${label} matches ${this.searchInput}`);
      console.log(`FilterProductModalComponent.filterList: did match: ${didMatch}`);
      return didMatch;
    });
  }

  selectLabel(label: string) {
    console.log(`FilterProductModalComponent.selectLabel: add label to list: ${label}`);
    try {
      this.safelyAddLabel(label);
      console.log(`FilterProductModalComponent.selectLabel: new label Filters: ${JSON.stringify(this.labelFilters)}`);
      this.currentLabelList = this.currentLabelList.filter((labelToCheck: string) => {
        return !(label == labelToCheck);
      });
      console.log(`FilterProductModalComponent.selectLabel: currentLabelList: ${JSON.stringify(this.currentLabelList)}`);
    } catch (error) {
      console.error(`FilterProductModalComponent.selectLabel: [ERROR] ${JSON.stringify(error)}`)
    }
  }

  removeLabel(removeLabel: string) {
    console.log(`FilterProductModalComponent.removeLabel: remove label from list: ${removeLabel}`);
    this.labelFilters = this.labelFilters.filter((label: string) => {
      const match = label.toLocaleLowerCase() == removeLabel.toLocaleLowerCase();
      console.log(`FilterProductModalComponent.removeLabel: match label ${label} to ${removeLabel}`);
      console.log(`FilterProductModalComponent.removeLabel: match result ${JSON.stringify(match)}`);
      return !match;
    });
    console.log(`FilterProductModalComponent.removeLabel: new label Filters: ${JSON.stringify(this.labelFilters)}`);
    this.currentLabelList = [removeLabel].concat(this.currentLabelList);
    console.log(`FilterProductModalComponent.removeLabel: currentLabelList: ${JSON.stringify(this.currentLabelList)}`);
  }

  confirmLabels() {
    return this.modalCtrl.dismiss(this.labelFilters, 'confirm');
  }

  private safelyAddLabel(label: string) {
    const labelFilters = this.labelFilters;
    labelFilters.push(label);
    this.labelFilters = [...new Set(labelFilters)];
    console.log(`FilterProductModalComponent.safelyAddLabel: new label filters after dedupe: ${this.labelFilters}`);
  }

  private async resetInput(): Promise<void> {
    this.searchInput = '';
  }
}

const fullLabelList = [
  "Organic",
  "No gluten",
  "EU Organic",
  "Green Dot",
  "Vegetarian",
  "Vegan",
  "Nutriscore",
  "No GMOs",
  "AB Agriculture Biologique",
  "No preservatives",
  "Non GMO project",
  "No colorings",
  "Made in France",
  "No added sugar",
  "No lactose",
  "EU Agriculture",
  "FR-BIO-01",
  "French meat",
  "Non-EU Agriculture",
  "EU/non-EU Agriculture",
  "Nutriscore Grade A",
  "Triman",
  "No artificial flavors",
  "Fair trade",
  "European Vegetarian Union",
  "USDA Organic",
  "No palm oil",
  "Halal",
  "Made in Italy",
  "EG-Öko-Verordnung",
  "Kosher",
  "PDO",
  "French pork",
  "FSC",
  "Sustainable",
  "Nutriscore Grade B",
  "European Vegetarian Union Vegan",
  "Nutriscore Grade C",
  "No additives",
  "Made in Germany",
  "PGI",
  "Nutriscore Grade D",
  "French poultry",
  "Sustainable farming",
  "FSC Mix",
  "Sustainable fishery",
  "Rainforest Alliance",
  "Sustainable Seafood MSC",
  "UTZ Certified",
  "Fairtrade International",
  "Not advised for specific people",
  "FR-BIO-10",
  "The Vegan Society",
  "Australian made",
  "Not advised for pregnant women",
  "Source of fibre",
  "Health Star Rating",
  "Made in Swiss",
  "No artificial colors",
  "Source of proteins",
  "Nutriscore Grade E",
  "High proteins",
  "French beef",
  "Label Rouge",
  "UTZ Certified Cocoa",
  "Low or no sugar",
  "Ohne Gentechnik",
  "Made in Belgium",
  "High fibres",
  "Made in Spain",
  "Produced in Brittany",
  "DE-ÖKO-001",
  "Max Havelaar",
  "IT-BIO-006",
  "NL-BIO-01",
  "ES-ECO-019-CT",
  "Biodynamic agriculture",
  "IT-BIO-009",
  "Demeter",
  "No flavors",
  "Natural flavors",
  "BE-BIO-01",
  "IT-BIO-007",
  "French milk",
  "Low or no fat",
  "Sustainable Palm Oil",
  "Canada Organic",
  "Orthodox Union Kosher",
  "Transformed in France",
  "Bleu Blanc Cœur",
  "eco-emballages",
  "CH-BIO-006",
  "German Agricultural Society",
  "100% natural",
  "No cholesterol",
  "Responsible aquaculture",
  "Responsible aquaculture ASC",
  "No sugar",
  "Gold medal of the German Agricultural Society",
  "Certified by Ecocert",
  "Made in the EU",
  "Pure cocoa butter",
  "DE-ÖKO-006",
  "pt:ecoponto-amarelo",
  "Distributor labels",
  "QS certification mark",
  "No artificial colours or flavours",
  "FR-BIO-09",
  "Low fat",
  "Low or no salt",
  "Soil Association Organic",
  "Naturland",
  "With Sunflower oil",
  "Crossed Grain Trademark",
  "Pasteurized",
  "European Vegetarian Union Vegetarian",
  "fr:Entrepreneurs + Engagés",
  "Superior quality",
  "Green Dot India",
  "No flavour enhancer",
  "COR Kosher",
  "Suisse Garantie",
  "DE-ÖKO-003",
  "es:Sin TACC",
  "Certified B Corporation",
  "IT-BIO-014",
  "Contains a source of phenylalanine",
  "Calcium source",
  "No milk",
  "Bioland",
  "Health Star Rating 4",
  "PEFC",
  "GB-ORG-05",
  "BE-BIO-02",
  "Vegan Action",
  "Pure butter",
  "Roundtable on Sustainable Palm Oil",
  "With sweeteners",
  "Low sugar",
  "EAC",
  "AT-BIO-301",
  "100% vegetable",
  "de:Bio 7 Initiative",
  "Free range",
  "Rainforest Alliance Cocoa",
  "ES-ECO-020-CV",
  "Bio",
  "Dolphin Safe",
  "Keyhole",
  "fr:Origine France",
  "Packaged in France",
  "Without",
  "fr:Sélection Intermarché",
  "Free range eggs",
  "No soy",
  "Veganok",
  "DE-ÖKO-007",
  "Sistema de Etiquetado Frontal de Alimentos y Bebidas",
  "Omega-3",
  "No artificial preservatives",
  "Bio Suisse",
  "Health Star Rating 3.5",
  "No fat",
  "Class I",
  "Reduced sugar",
  "HACCP",
  "Health Star Rating 5",
  "Verified"
]
