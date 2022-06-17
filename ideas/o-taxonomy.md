# Plant Taxonomy

Provide a way to define the taxonomy of the created plant.


## GBIF Plant API

```bash
# We can get the key of the plant through this api
curl https://api.gbif.org/v1/species/search/\?q\=Bellis%20Perennis\&language\=en\&limit\=1 | jq '.results'

# With the key we can get a list of images
https://api.gbif.org/v1/species/3117424/media

```

## Online Taxonomy Databases

[Australasian Virtual Herbarium](http://avh.chah.org.au/)

The Australasian Virtual Herbarium (AVH) is an online resource that allows access to plant specimen data held by various Australian and New Zealand herbaria. It is part of the Atlas of Living Australia (ALA), and was formed by the amalgamation of Australia's Virtual Herbarium and NZ Virtual Herbarium. 
As of 12 August 2014, more than five million specimens of the 8 million and upwards specimens available from participating institutions have been databased.

[Australian Plant Name Index (APNI)](https://biodiversity.org.au/nsl/services/search)

The Australian Plant Census (APC) is a list of the accepted scientific names for the Australian vascular flora, ferns, gymnosperms, hornworts and liverworts, both native and introduced, and includes synonyms and misapplications for these names.

[Australian Tropical Rainforest Plants](https://apps.lucidcentral.org/rainforest)

[CNPS Rare Plant Inventory](https://rareplants.cnps.org/)

A resource for information about California's rare plants to promote education, scientific research, conservation planning, and effective enforcement of environmental laws.

[Flora Europea](http://ww2.bgbm.org/EuroPlusMed/query.asp)

The Euro+Med PlantBase - the information resource for Euro-Mediterranean plant diversity

[FloraBase](https://florabase.dpaw.wa.gov.au/)

Florabase is a dynamic and interactive resource brought to you by the Western Australian Herbarium that provides information about our State’s extraordinary botanical diversity. 

[Tropicos](https://tropicos.org/home)
