import React from "react";
import jwt_decode from "jwt-decode";
import swal from "sweetalert";
import PetlyApi from "../api";

const WARNING = "Please fill out the required fields";
const ERROR = "Oops, somthing's wrong";
const USSTATES = [
  { name: "ALABAMA", abbreviation: "AL" },
  { name: "ALASKA", abbreviation: "AK" },
  { name: "AMERICAN SAMOA", abbreviation: "AS" },
  { name: "ARIZONA", abbreviation: "AZ" },
  { name: "ARKANSAS", abbreviation: "AR" },
  { name: "CALIFORNIA", abbreviation: "CA" },
  { name: "COLORADO", abbreviation: "CO" },
  { name: "CONNECTICUT", abbreviation: "CT" },
  { name: "DELAWARE", abbreviation: "DE" },
  { name: "DISTRICT OF COLUMBIA", abbreviation: "DC" },
  { name: "FEDERATED STATES OF MICRONESIA", abbreviation: "FM" },
  { name: "FLORIDA", abbreviation: "FL" },
  { name: "GEORGIA", abbreviation: "GA" },
  { name: "GUAM", abbreviation: "GU" },
  { name: "HAWAII", abbreviation: "HI" },
  { name: "IDAHO", abbreviation: "ID" },
  { name: "ILLINOIS", abbreviation: "IL" },
  { name: "INDIANA", abbreviation: "IN" },
  { name: "IOWA", abbreviation: "IA" },
  { name: "KANSAS", abbreviation: "KS" },
  { name: "KENTUCKY", abbreviation: "KY" },
  { name: "LOUISIANA", abbreviation: "LA" },
  { name: "MAINE", abbreviation: "ME" },
  { name: "MARSHALL ISLANDS", abbreviation: "MH" },
  { name: "MARYLAND", abbreviation: "MD" },
  { name: "MASSACHUSETTS", abbreviation: "MA" },
  { name: "MICHIGAN", abbreviation: "MI" },
  { name: "MINNESOTA", abbreviation: "MN" },
  { name: "MISSISSIPPI", abbreviation: "MS" },
  { name: "MISSOURI", abbreviation: "MO" },
  { name: "MONTANA", abbreviation: "MT" },
  { name: "NEBRASKA", abbreviation: "NE" },
  { name: "NEVADA", abbreviation: "NV" },
  { name: "NEW HAMPSHIRE", abbreviation: "NH" },
  { name: "NEW JERSEY", abbreviation: "NJ" },
  { name: "NEW MEXICO", abbreviation: "NM" },
  { name: "NEW YORK", abbreviation: "NY" },
  { name: "NORTH CAROLINA", abbreviation: "NC" },
  { name: "NORTH DAKOTA", abbreviation: "ND" },
  { name: "NORTHERN MARIANA ISLANDS", abbreviation: "MP" },
  { name: "OHIO", abbreviation: "OH" },
  { name: "OKLAHOMA", abbreviation: "OK" },
  { name: "OREGON", abbreviation: "OR" },
  { name: "PALAU", abbreviation: "PW" },
  { name: "PENNSYLVANIA", abbreviation: "PA" },
  { name: "PUERTO RICO", abbreviation: "PR" },
  { name: "RHODE ISLAND", abbreviation: "RI" },
  { name: "SOUTH CAROLINA", abbreviation: "SC" },
  { name: "SOUTH DAKOTA", abbreviation: "SD" },
  { name: "TENNESSEE", abbreviation: "TN" },
  { name: "TEXAS", abbreviation: "TX" },
  { name: "UTAH", abbreviation: "UT" },
  { name: "VERMONT", abbreviation: "VT" },
  { name: "VIRGIN ISLANDS", abbreviation: "VI" },
  { name: "VIRGINIA", abbreviation: "VA" },
  { name: "WASHINGTON", abbreviation: "WA" },
  { name: "WEST VIRGINIA", abbreviation: "WV" },
  { name: "WISCONSIN", abbreviation: "WI" },
  { name: "WYOMING", abbreviation: "WY" },
];

const DOGBREEDS = [
  { id: 1, breed: "Affenpinscher" },
  { id: 2, breed: "Afghan Hound" },
  { id: 3, breed: "Airedale Terrier" },
  { id: 4, breed: "Akbash" },
  { id: 5, breed: "Akita" },
  { id: 6, breed: "Alaskan Malamute" },
  { id: 7, breed: "American Bulldog" },
  { id: 8, breed: "American Bully" },
  { id: 9, breed: "American Eskimo Dog" },
  { id: 10, breed: "American Foxhound" },
  { id: 11, breed: "American Hairless Terrier" },
  { id: 12, breed: "American Staffordshire Terrier" },
  { id: 13, breed: "American Water Spaniel" },
  { id: 14, breed: "Anatolian Shepherd" },
  { id: 15, breed: "Appenzell Mountain Dog" },
  { id: 16, breed: "Aussiedoodle" },
  { id: 17, breed: "Australian Cattle Dog / Blue Heeler" },
  { id: 18, breed: "Australian Kelpie" },
  { id: 19, breed: "Australian Shepherd" },
  { id: 20, breed: "Australian Terrier" },
  { id: 21, breed: "Basenji" },
  { id: 22, breed: "Basset Hound" },
  { id: 23, breed: "Beagle" },
  { id: 24, breed: "Bearded Collie" },
  { id: 25, breed: "Beauceron" },
  { id: 26, breed: "Bedlington Terrier" },
  { id: 27, breed: "Belgian Shepherd / Laekenois" },
  { id: 28, breed: "Belgian Shepherd / Malinois" },
  { id: 29, breed: "Belgian Shepherd / Sheepdog" },
  { id: 30, breed: "Belgian Shepherd / Tervuren" },
  { id: 31, breed: "Bernedoodle" },
  { id: 32, breed: "Bernese Mountain Dog" },
  { id: 33, breed: "Bichon Frise" },
  { id: 34, breed: "Black and Tan Coonhound" },
  { id: 35, breed: "Black Labrador Retriever" },
  { id: 36, breed: "Black Mouth Cur" },
  { id: 37, breed: "Black Russian Terrier" },
  { id: 38, breed: "Bloodhound" },
  { id: 39, breed: "Blue Lacy" },
  { id: 40, breed: "Bluetick Coonhound" },
  { id: 41, breed: "Boerboel" },
  { id: 42, breed: "Bolognese" },
  { id: 43, breed: "Border Collie" },
  { id: 44, breed: "Border Terrier" },
  { id: 45, breed: "Borzoi" },
  { id: 46, breed: "Boston Terrier" },
  { id: 47, breed: "Bouvier des Flandres" },
  { id: 48, breed: "Boxer" },
  { id: 49, breed: "Boykin Spaniel" },
  { id: 50, breed: "Briard" },
  { id: 51, breed: "Brittany Spaniel" },
  { id: 52, breed: "Brussels Griffon" },
  { id: 53, breed: "Bull Terrier" },
  { id: 54, breed: "Bullmastiff" },
  { id: 55, breed: "Cairn Terrier" },
  { id: 56, breed: "Canaan Dog" },
  { id: 57, breed: "Cane Corso" },
  { id: 58, breed: "Cardigan Welsh Corgi" },
  { id: 59, breed: "Carolina Dog" },
  { id: 60, breed: "Catahoula Leopard Dog" },
  { id: 61, breed: "Cattle Dog" },
  { id: 62, breed: "Caucasian Sheepdog / Caucasian Ovtcharka" },
  { id: 63, breed: "Cavachon" },
  { id: 64, breed: "Cavalier King Charles Spaniel" },
  { id: 65, breed: "Cavapoo" },
  { id: 66, breed: "Chesapeake Bay Retriever" },
  { id: 67, breed: "Chihuahua" },
  { id: 68, breed: "Chinese Crested Dog" },
  { id: 69, breed: "Chinese Foo Dog" },
  { id: 70, breed: "Chinook" },
  { id: 71, breed: "Chiweenie" },
  { id: 72, breed: "Chocolate Labrador Retriever" },
  { id: 73, breed: "Chow Chow" },
  { id: 74, breed: "Cirneco dell Etna" },
  { id: 75, breed: "Clumber Spaniel" },
  { id: 76, breed: "Cockapoo" },
  { id: 77, breed: "Cocker Spaniel" },
  { id: 78, breed: "Collie" },
  { id: 79, breed: "Coonhound" },
  { id: 80, breed: "Corgi" },
  { id: 81, breed: "Coton de Tulear" },
  { id: 82, breed: "Curly-Coated Retriever" },
  { id: 83, breed: "Dachshund" },
  { id: 84, breed: "Dalmatian" },
  { id: 85, breed: "Dandie Dinmont Terrier" },
  { id: 86, breed: "Doberman Pinscher" },
  { id: 87, breed: "Dogo Argentino" },
  { id: 88, breed: "Dogue de Bordeaux" },
  { id: 89, breed: "Dutch Shepherd" },
  { id: 90, breed: "English Bulldog" },
  { id: 91, breed: "English Cocker Spaniel" },
  { id: 92, breed: "English Coonhound" },
  { id: 93, breed: "English Foxhound" },
  { id: 94, breed: "English Pointer" },
  { id: 95, breed: "English Setter" },
  { id: 96, breed: "English Shepherd" },
  { id: 97, breed: "English Springer Spaniel" },
  { id: 98, breed: "English Toy Spaniel" },
  { id: 99, breed: "Entlebucher" },
  { id: 100, breed: "Eskimo Dog" },
  { id: 101, breed: "Feist" },
  { id: 102, breed: "Field Spaniel" },
  { id: 103, breed: "Fila Brasileiro" },
  { id: 104, breed: "Finnish Lapphund" },
  { id: 105, breed: "Finnish Spitz" },
  { id: 106, breed: "Flat-Coated Retriever" },
  { id: 107, breed: "Fox Terrier" },
  { id: 108, breed: "Foxhound" },
  { id: 109, breed: "French Bulldog" },
  { id: 110, breed: "Galgo Spanish Greyhound" },
  { id: 111, breed: "German Pinscher" },
  { id: 112, breed: "German Shepherd Dog" },
  { id: 113, breed: "German Shorthaired Pointer" },
  { id: 114, breed: "German Spitz" },
  { id: 115, breed: "German Wirehaired Pointer" },
  { id: 116, breed: "Giant Schnauzer" },
  { id: 117, breed: "Glen of Imaal Terrier" },
  { id: 118, breed: "Golden Retriever" },
  { id: 119, breed: "Goldendoodle" },
  { id: 120, breed: "Gordon Setter" },
  { id: 121, breed: "Great Dane" },
  { id: 122, breed: "Great Pyrenees" },
  { id: 123, breed: "Greater Swiss Mountain Dog" },
  { id: 124, breed: "Greyhound" },
  { id: 125, breed: "Hamiltonstovare" },
  { id: 126, breed: "Harrier" },
  { id: 127, breed: "Havanese" },
  { id: 128, breed: "Hound" },
  { id: 129, breed: "Hovawart" },
  { id: 130, breed: "Husky" },
  { id: 131, breed: "Ibizan Hound" },
  { id: 132, breed: "Icelandic Sheepdog" },
  { id: 133, breed: "Illyrian Sheepdog" },
  { id: 134, breed: "Irish Setter" },
  { id: 135, breed: "Irish Terrier" },
  { id: 136, breed: "Irish Water Spaniel" },
  { id: 137, breed: "Irish Wolfhound" },
  { id: 138, breed: "Italian Greyhound" },
  { id: 139, breed: "Jack Russell Terrier" },
  { id: 140, breed: "Japanese Chin" },
  { id: 141, breed: "Jindo" },
  { id: 142, breed: "Kai Dog" },
  { id: 143, breed: "Karelian Bear Dog" },
  { id: 144, breed: "Keeshond" },
  { id: 145, breed: "Kerry Blue Terrier" },
  { id: 146, breed: "Kishu" },
  { id: 147, breed: "Klee Kai" },
  { id: 148, breed: "Komondor" },
  { id: 149, breed: "Kuvasz" },
  { id: 150, breed: "Kyi Leo" },
  { id: 151, breed: "Labradoodle" },
  { id: 152, breed: "Labrador Retriever" },
  { id: 153, breed: "Lakeland Terrier" },
  { id: 154, breed: "Lancashire Heeler" },
  { id: 155, breed: "Leonberger" },
  { id: 156, breed: "Lhasa Apso" },
  { id: 157, breed: "Lowchen" },
  { id: 158, breed: "Lurcher" },
  { id: 159, breed: "Maltese" },
  { id: 160, breed: "Maltipoo" },
  { id: 161, breed: "Manchester Terrier" },
  { id: 162, breed: "Maremma Sheepdog" },
  { id: 163, breed: "Mastiff" },
  { id: 164, breed: "McNab" },
  { id: 165, breed: "Miniature Bull Terrier" },
  { id: 166, breed: "Miniature Dachshund" },
  { id: 167, breed: "Miniature Pinscher" },
  { id: 168, breed: "Miniature Poodle" },
  { id: 169, breed: "Miniature Schnauzer" },
  { id: 170, breed: "Mixed Breed" },
  { id: 171, breed: "Morkie" },
  { id: 172, breed: "Mountain Cur" },
  { id: 173, breed: "Mountain Dog" },
  { id: 174, breed: "Munsterlander" },
  { id: 175, breed: "Neapolitan Mastiff" },
  { id: 176, breed: "New Guinea Singing Dog" },
  { id: 177, breed: "Newfoundland Dog" },
  { id: 178, breed: "Norfolk Terrier" },
  { id: 179, breed: "Norwegian Buhund" },
  { id: 180, breed: "Norwegian Elkhound" },
  { id: 181, breed: "Norwegian Lundehund" },
  { id: 182, breed: "Norwich Terrier" },
  { id: 183, breed: "Nova Scotia Duck Tolling Retriever" },
  { id: 184, breed: "Old English Sheepdog" },
  { id: 185, breed: "Otterhound" },
  { id: 186, breed: "Papillon" },
  { id: 187, breed: "Parson Russell Terrier" },
  { id: 188, breed: "Patterdale Terrier / Fell Terrier" },
  { id: 189, breed: "Pekingese" },
  { id: 190, breed: "Pembroke Welsh Corgi" },
  { id: 191, breed: "Peruvian Inca Orchid" },
  { id: 192, breed: "Petit Basset Griffon Vendeen" },
  { id: 193, breed: "Pharaoh Hound" },
  { id: 194, breed: "Pit Bull Terrier" },
  { id: 195, breed: "Plott Hound" },
  { id: 196, breed: "Pointer" },
  { id: 197, breed: "Polish Lowland Sheepdog" },
  { id: 198, breed: "Pomeranian" },
  { id: 199, breed: "Pomsky" },
  { id: 200, breed: "Poodle" },
  { id: 201, breed: "Portuguese Podengo" },
  { id: 202, breed: "Portuguese Water Dog" },
  { id: 203, breed: "Presa Canario" },
  { id: 204, breed: "Pug" },
  { id: 205, breed: "Puggle" },
  { id: 206, breed: "Puli" },
  { id: 207, breed: "Pumi" },
  { id: 208, breed: "Pyrenean Shepherd" },
  { id: 209, breed: "Rat Terrier" },
  { id: 210, breed: "Redbone Coonhound" },
  { id: 211, breed: "Retriever" },
  { id: 212, breed: "Rhodesian Ridgeback" },
  { id: 213, breed: "Rottweiler" },
  { id: 214, breed: "Rough Collie" },
  { id: 215, breed: "Saint Bernard" },
  { id: 216, breed: "Saluki" },
  { id: 217, breed: "Samoyed" },
  { id: 218, breed: "Sarplaninac" },
  { id: 219, breed: "Schipperke" },
  { id: 220, breed: "Schnauzer" },
  { id: 221, breed: "Schnoodle" },
  { id: 222, breed: "Scottish Deerhound" },
  { id: 223, breed: "Scottish Terrier" },
  { id: 224, breed: "Sealyham Terrier" },
  { id: 225, breed: "Setter" },
  { id: 226, breed: "Shar-Pei" },
  { id: 227, breed: "Sheep Dog" },
  { id: 228, breed: "Sheepadoodle" },
  { id: 229, breed: "Shepherd" },
  { id: 230, breed: "Shetland Sheepdog / Sheltie" },
  { id: 231, breed: "Shiba Inu" },
  { id: 232, breed: "Shih poo" },
  { id: 233, breed: "Shih Tzu" },
  { id: 234, breed: "Shollie" },
  { id: 235, breed: "Siberian Husky" },
  { id: 236, breed: "Silky Terrier" },
  { id: 237, breed: "Skye Terrier" },
  { id: 238, breed: "Sloughi" },
  { id: 239, breed: "Smooth Collie" },
  { id: 240, breed: "Smooth Fox Terrier" },
  { id: 241, breed: "South Russian Ovtcharka" },
  { id: 242, breed: "Spaniel" },
  { id: 243, breed: "Spanish Water Dog" },
  { id: 244, breed: "Spinone Italiano" },
  { id: 245, breed: "Spitz" },
  { id: 246, breed: "Staffordshire Bull Terrier" },
  { id: 247, breed: "Standard Poodle" },
  { id: 248, breed: "Standard Schnauzer" },
  { id: 249, breed: "Sussex Spaniel" },
  { id: 250, breed: "Swedish Vallhund" },
  { id: 251, breed: "Tennessee Treeing Brindle" },
  { id: 252, breed: "Terrier" },
  { id: 253, breed: "Thai Ridgeback" },
  { id: 254, breed: "Tibetan Mastiff" },
  { id: 255, breed: "Tibetan Spaniel" },
  { id: 256, breed: "Tibetan Terrier" },
  { id: 257, breed: "Tosa Inu" },
  { id: 258, breed: "Toy Fox Terrier" },
  { id: 259, breed: "Toy Manchester Terrier" },
  { id: 260, breed: "Treeing Walker Coonhound" },
  { id: 261, breed: "Vizsla" },
  { id: 262, breed: "Weimaraner" },
  { id: 263, breed: "Welsh Springer Spaniel" },
  { id: 264, breed: "Welsh Terrier" },
  { id: 265, breed: "West Highland White Terrier / Westie" },
  { id: 266, breed: "Wheaten Terrier" },
  { id: 267, breed: "Whippet" },
  { id: 268, breed: "White German Shepherd" },
  { id: 269, breed: "Wire Fox Terrier" },
  { id: 270, breed: "Wirehaired Dachshund" },
  { id: 271, breed: "Wirehaired Pointing Griffon" },
  { id: 272, breed: "Wirehaired Terrier" },
  { id: 273, breed: "Xoloitzcuintli / Mexican Hairless" },
  { id: 274, breed: "Yellow Labrador Retriever" },
  { id: 275, breed: "Yorkshire Terrier" },
];

const createStateOptions = USStates => {
  return USSTATES.map((state, id) => {
    return (
      <option key={id} value={state.abbreviation}>
        {state.abbreviation}
      </option>
    );
  });
};

const createBreedOptions = DOGBREEDS => {
  return DOGBREEDS.map(breed => {
    return (
      <option key={breed.id} value={breed.id}>
        {breed.breed}
      </option>
    );
  });
};

const createInput = (
  name,
  type,
  value,
  handleChange,
  label,
  required = false,
  labelClassName = "",
  inputClassName = ""
) => {
  return (
    <>
      <label className={labelClassName}>
        {label}
        {required ? "*" : ""}:
      </label>
      <input
        placeholder={label}
        name={name}
        id={name}
        type={type}
        value={value}
        onChange={handleChange}
        className={inputClassName}
      ></input>
    </>
  );
};

const checkAllRequiredField = fields => {
  let result = fields.every(field => field !== "");
  return result;
};

const convertToYesNo = boolean => {
  if (boolean === null) {
    return "N/A";
  } else if (boolean) {
    return "Yes";
  } else if (!boolean) {
    return "NO";
  }
};

const getFavoriteDogs = async (
  user,
  setFavoriteDogs,
  setIsFavoriteDogsLoading,
  token
) => {
  try {
    const favDogs = await PetlyApi.getFavoriteDogs(user.username, token);
    setFavoriteDogs(favDogs);
    setIsFavoriteDogsLoading(false);
  } catch (err) {
    console.log(err);
    swal({ text: err[0], icon: "warning" });
  }
};

const getUser = async (
  setToken,
  setUser,
  token,
  setFavoriteDogs,
  setIsFavoriteDogsLoading
) => {
  try {
    //check first if there is token in localStorage
    if (token) {
      //decode the token
      const tokenInfo = jwt_decode(token);
      //check the userType on token because we have two types: adopters and shelters
      if (tokenInfo.userType === "shelters") {
        const user = await PetlyApi.get(
          tokenInfo.userType,
          tokenInfo.id,
          token
        );
        //check if we have this user in db, if not, token may expire or no that user
        if (user) {
          setUser(tokenInfo);
        }
      } else if (tokenInfo.userType === "adopters") {
        const user = await PetlyApi.get(
          tokenInfo.userType,
          tokenInfo.username,
          token
        );
        //check if we have this user in db, if not, token may expire or no that user
        if (user) {
          getFavoriteDogs(
            user,
            setFavoriteDogs,
            setIsFavoriteDogsLoading,
            token
          );
          setUser(tokenInfo);
        }
      }
    }
  } catch (err) {
    setUser(null);
    setToken(null);
    console.log(err);
  }
};

const checkImageName = url => {
  if (url.match(/.(jpg|jpeg|png|gif)$/i)) {
    return true;
  } else {
    swal({
      text: "Not an image",
      icon: "warning",
    });
    return false;
  }
};

export {
  getFavoriteDogs,
  getUser,
  createInput,
  checkAllRequiredField,
  WARNING,
  ERROR,
  USSTATES,
  createStateOptions,
  convertToYesNo,
  createBreedOptions,
  DOGBREEDS,
  checkImageName,
};
