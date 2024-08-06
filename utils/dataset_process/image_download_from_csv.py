import pandas as pd

# pd.set_option("display.max_rows", None)

data = pd.read_csv(
    "C:/Users/SSAFY/Desktop/S11P12B304/dataset_processing/data/iNaturalist.csv"
)

df = pd.DataFrame(data)

"""
['id', 'url', 'image_url', 'sound_url', 'tag_list', 'description',
 'num_identification_agreements', 'num_identification_disagreements',
 'oauth_application_id', 'species_guess', 'scientific_name',
 'common_name', 'iconic_taxon_name', 'taxon_id']
"""

# print(df["iconic_taxon_name"].drop_duplicates())

"""
0    Amphibia    양서류
1    Mammalia    포유류
2    Aves        조류
3    Insecta     곤충
4    Plantae     식물
5    Reptilia    파충류
6    Animalia    동물
7    Mollusca    연체동물
8    Fungi       균류(버섯)
9    Arachnida   거미
"""

# print(df["species_guess"].drop_duplicates())
# print(df["species_guess"].value_counts())

# species = df["species_guess"].drop_duplicates()
# species = df[["species_guess", "iconic_taxon_name"]].value_counts()
# species.to_csv("./data/species_count.csv")

import os
import requests
import pandas as pd

SAVE_DIR = "./data/img"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)


def downLoadURLResource(row):
    taxon = row["iconic_taxon_name"]
    species_guess = row["species_guess"]
    url = row["image_url"]

    r = requests.get(url.rstrip(), stream=True)
    if r.status_code == 200 and "Frog" in species_guess:
        target_file_name = "{}_{}.jpg".format(taxon, species_guess)
        with open(os.path.join(SAVE_DIR, target_file_name), "wb") as f:
            for chunk in r.iter_content(chunk_size=1024):
                f.write(chunk)
        return target_file_name
    return None


# Read CSV file
csv_file_path = "./data/iNaturalist.csv"
df = pd.read_csv(csv_file_path)

# print(len(df))
# Check if the 'image_url' and 'species_guess' columns exist in the dataframe
if (
    "image_url" in df.columns
    and "species_guess" in df.columns
    and "iconic_taxon_name" in df.columns
):
    downloaded_files = df.apply(downLoadURLResource, axis=1)
    print(downloaded_files.dropna().tolist())
else:
    print(
        "The columns 'image_url' and/or 'species_guess' and/or 'iconic_taxon_name' do not exist in the CSV file."
    )
