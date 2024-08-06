import pandas as pd

data = pd.read_csv(
    "C:/Users/SSAFY/Desktop/S11P12B304/dataset_processing/data/iNaturalist.csv"
)

df = pd.DataFrame(data)

taxon_list = [
    "Amphibia",
    "Mammalia",
    "Aves",
    "Insecta",
    "Plantae",
    "Reptilia",
    "Animalia",
    "Mollusca",
    "Fungi",
    "Arachnida",
]

for taxon in taxon_list:
    length = len(df.loc[df["iconic_taxon_name"] == f"{taxon}"])
    print(taxon, length)
