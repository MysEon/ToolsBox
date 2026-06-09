export interface StateInfo {
  name: string;
  abbreviation: string;
  cities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  taxFree: boolean; // 是否为免税州
  salesTaxRate?: number; // 销售税率（如果有的话）
}

// 获取免税州列表
export function getTaxFreeStates(): StateInfo[] {
  return US_STATES.filter(state => state.taxFree);
}

// 获取有税州列表
export function getTaxableStates(): StateInfo[] {
  return US_STATES.filter(state => !state.taxFree);
}

export const US_STATES: StateInfo[] = [
  {
    name: "Alabama",
    abbreviation: "AL",
    coordinates: { lat: 32.806671, lng: -86.791130 },
    cities: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa", "Hoover", "Dothan", "Auburn", "Decatur", "Madison"],
    taxFree: false,
    salesTaxRate: 4.0
  },
  {
    name: "Alaska",
    abbreviation: "AK", 
    coordinates: { lat: 61.370716, lng: -152.404419 },
    cities: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan", "Wasilla", "Kenai", "Kodiak", "Bethel", "Palmer"],
    taxFree: true, // 免税州
    salesTaxRate: 0
  },
  {
    name: "Arizona",
    abbreviation: "AZ",
    coordinates: { lat: 33.729759, lng: -111.431221 },
    cities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale", "Gilbert", "Tempe", "Peoria", "Surprise"],
    taxFree: false,
    salesTaxRate: 5.6
  },
  {
    name: "Arkansas", 
    abbreviation: "AR",
    coordinates: { lat: 34.969704, lng: -92.373123 },
    cities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro", "North Little Rock", "Conway", "Rogers", "Pine Bluff", "Bentonville"],
    taxFree: false,
    salesTaxRate: 6.5
  },
  {
    name: "California",
    abbreviation: "CA",
    coordinates: { lat: 36.116203, lng: -119.681564 },
    cities: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim"],
    taxFree: false,
    salesTaxRate: 7.25
  },
  {
    name: "Colorado",
    abbreviation: "CO", 
    coordinates: { lat: 39.059811, lng: -105.311104 },
    cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Thornton", "Arvada", "Westminster", "Pueblo", "Centennial"],
    taxFree: false,
    salesTaxRate: 2.9
  },
  {
    name: "Connecticut",
    abbreviation: "CT",
    coordinates: { lat: 41.597782, lng: -72.755371 },
    cities: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury", "Norwalk", "Danbury", "New Britain", "West Hartford", "Greenwich"],
    taxFree: false,
    salesTaxRate: 6.35
  },
  {
    name: "Delaware",
    abbreviation: "DE",
    coordinates: { lat: 39.318523, lng: -75.507141 },
    cities: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna", "Milford", "Seaford", "Georgetown", "Elsmere", "New Castle"],
    taxFree: true, // 免税州
    salesTaxRate: 0
  },
  {
    name: "Florida",
    abbreviation: "FL",
    coordinates: { lat: 27.766279, lng: -81.686783 },
    cities: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St. Lucie", "Cape Coral"],
    taxFree: true, // 免税州（无个人所得税）
    salesTaxRate: 6.0
  },
  {
    name: "Georgia",
    abbreviation: "GA",
    coordinates: { lat: 33.040619, lng: -83.643074 },
    cities: ["Atlanta", "Augusta", "Columbus", "Macon", "Savannah", "Athens", "Sandy Springs", "Roswell", "Johns Creek", "Albany"],
    taxFree: false,
    salesTaxRate: 4.0
  },
  {
    name: "Hawaii",
    abbreviation: "HI",
    coordinates: { lat: 21.094318, lng: -157.498337 },
    cities: ["Honolulu", "East Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu", "Kaneohe", "Kailua-Kona", "Kahului", "Mililani"],
    taxFree: false,
    salesTaxRate: 4.0
  },
  {
    name: "Idaho",
    abbreviation: "ID",
    coordinates: { lat: 44.240459, lng: -114.478828 },
    cities: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello", "Caldwell", "Coeur d'Alene", "Twin Falls", "Lewiston", "Post Falls"],
    taxFree: false,
    salesTaxRate: 6.0
  },
  {
    name: "Illinois",
    abbreviation: "IL",
    coordinates: { lat: 40.349457, lng: -88.986137 },
    cities: ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville", "Springfield", "Peoria", "Elgin", "Waukegan", "Cicero"],
    taxFree: false,
    salesTaxRate: 6.25
  },
  {
    name: "Indiana",
    abbreviation: "IN",
    coordinates: { lat: 39.849426, lng: -86.258278 },
    cities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel", "Fishers", "Bloomington", "Hammond", "Gary", "Muncie"],
    taxFree: false,
    salesTaxRate: 7.0
  },
  {
    name: "Iowa",
    abbreviation: "IA",
    coordinates: { lat: 42.011539, lng: -93.210526 },
    cities: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City", "Waterloo", "Council Bluffs", "Ames", "West Des Moines", "Dubuque"],
    taxFree: false,
    salesTaxRate: 6.0
  },
  {
    name: "Kansas",
    abbreviation: "KS",
    coordinates: { lat: 38.526600, lng: -96.726486 },
    cities: ["Wichita", "Overland Park", "Kansas City", "Topeka", "Olathe", "Lawrence", "Shawnee", "Manhattan", "Lenexa", "Salina"],
    taxFree: false,
    salesTaxRate: 6.5
  },
  {
    name: "Kentucky",
    abbreviation: "KY",
    coordinates: { lat: 37.668140, lng: -84.670067 },
    cities: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington", "Richmond", "Georgetown", "Florence", "Hopkinsville", "Nicholasville"],
    taxFree: false,
    salesTaxRate: 6.0
  },
  {
    name: "Louisiana",
    abbreviation: "LA",
    coordinates: { lat: 31.169546, lng: -91.867805 },
    cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles", "Kenner", "Bossier City", "Monroe", "Alexandria", "Houma"],
    taxFree: false,
    salesTaxRate: 4.45
  },
  {
    name: "Maine",
    abbreviation: "ME",
    coordinates: { lat: 44.693947, lng: -69.381927 },
    cities: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn", "Biddeford", "Sanford", "Saco", "Augusta", "Westbrook"],
    taxFree: false,
    salesTaxRate: 5.5
  },
  {
    name: "Maryland",
    abbreviation: "MD",
    coordinates: { lat: 39.063946, lng: -76.802101 },
    cities: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Bowie", "Hagerstown", "Annapolis", "College Park", "Salisbury", "Laurel"],
    taxFree: false,
    salesTaxRate: 6.0
  },
  {
    name: "Massachusetts",
    abbreviation: "MA",
    coordinates: { lat: 42.230171, lng: -71.530106 },
    cities: ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge", "New Bedford", "Brockton", "Quincy", "Lynn", "Fall River"],
    taxFree: false,
    salesTaxRate: 6.25
  },
  {
    name: "Michigan",
    abbreviation: "MI",
    coordinates: { lat: 43.326618, lng: -84.536095 },
    cities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Lansing", "Ann Arbor", "Flint", "Dearborn", "Livonia", "Westland"],
    taxFree: false,
    salesTaxRate: 6.0
  },
  {
    name: "Minnesota",
    abbreviation: "MN",
    coordinates: { lat: 45.694454, lng: -93.900192 },
    cities: ["Minneapolis", "Saint Paul", "Rochester", "Duluth", "Bloomington", "Brooklyn Park", "Plymouth", "Saint Cloud", "Eagan", "Woodbury"],
    taxFree: false,
    salesTaxRate: 6.875
  },
  {
    name: "Mississippi",
    abbreviation: "MS",
    coordinates: { lat: 32.741646, lng: -89.678696 },
    cities: ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi", "Meridian", "Tupelo", "Greenville", "Olive Branch", "Horn Lake"],
    taxFree: false,
    salesTaxRate: 7.0
  },
  {
    name: "Missouri",
    abbreviation: "MO",
    coordinates: { lat: 38.456085, lng: -92.288368 },
    cities: ["Kansas City", "Saint Louis", "Springfield", "Independence", "Columbia", "Lee's Summit", "O'Fallon", "St. Joseph", "St. Charles", "St. Peters"],
    taxFree: false,
    salesTaxRate: 4.225
  },
  {
    name: "Montana",
    abbreviation: "MT",
    coordinates: { lat: 47.040182, lng: -109.641113 },
    cities: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte", "Helena", "Kalispell", "Havre", "Anaconda", "Miles City"],
    taxFree: true, // 免税州
    salesTaxRate: 0
  },
  {
    name: "Nebraska",
    abbreviation: "NE",
    coordinates: { lat: 41.125370, lng: -98.268082 },
    cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney", "Fremont", "Hastings", "North Platte", "Norfolk", "Columbus"],
    taxFree: false,
    salesTaxRate: 5.5
  },
  {
    name: "Nevada",
    abbreviation: "NV",
    coordinates: { lat: 38.313515, lng: -117.055374 },
    cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City", "Fernley", "Elko", "Mesquite", "Boulder City"],
    taxFree: true, // 免税州（无个人所得税）
    salesTaxRate: 6.85
  },
  {
    name: "New Hampshire",
    abbreviation: "NH",
    coordinates: { lat: 43.452492, lng: -71.563896 },
    cities: ["Manchester", "Nashua", "Concord", "Derry", "Rochester", "Salem", "Dover", "Merrimack", "Londonderry", "Hudson"],
    taxFree: true, // 免税州
    salesTaxRate: 0
  },
  {
    name: "New Jersey",
    abbreviation: "NJ",
    coordinates: { lat: 40.298904, lng: -74.521011 },
    cities: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Woodbridge", "Lakewood", "Toms River", "Hamilton", "Trenton"],
    taxFree: false,
    salesTaxRate: 6.625
  },
  {
    name: "New Mexico",
    abbreviation: "NM",
    coordinates: { lat: 34.840515, lng: -106.248482 },
    cities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell", "Farmington", "Clovis", "Hobbs", "Alamogordo", "Carlsbad"],
    taxFree: false,
    salesTaxRate: 5.125
  },
  {
    name: "New York",
    abbreviation: "NY",
    coordinates: { lat: 42.165726, lng: -74.948051 },
    cities: ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany", "New Rochelle", "Mount Vernon", "Schenectady", "Utica"],
    taxFree: false,
    salesTaxRate: 4.0
  },
  {
    name: "North Carolina",
    abbreviation: "NC",
    coordinates: { lat: 35.630066, lng: -79.806419 },
    cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville", "Cary", "Wilmington", "High Point", "Concord"],
    taxFree: false,
    salesTaxRate: 4.75
  },
  {
    name: "North Dakota",
    abbreviation: "ND",
    coordinates: { lat: 47.528912, lng: -99.784012 },
    cities: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo", "Williston", "Dickinson", "Mandan", "Jamestown", "Wahpeton"],
    taxFree: false,
    salesTaxRate: 5.0
  },
  {
    name: "Ohio",
    abbreviation: "OH",
    coordinates: { lat: 40.388783, lng: -82.764915 },
    cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton", "Parma", "Canton", "Youngstown", "Lorain"],
    taxFree: false,
    salesTaxRate: 5.75
  },
  {
    name: "Oklahoma",
    abbreviation: "OK",
    coordinates: { lat: 35.565342, lng: -96.928917 },
    cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Lawton", "Edmond", "Moore", "Midwest City", "Enid", "Stillwater"],
    taxFree: false,
    salesTaxRate: 4.5
  },
  {
    name: "Oregon",
    abbreviation: "OR",
    coordinates: { lat: 44.572021, lng: -122.070938 },
    cities: ["Portland", "Eugene", "Salem", "Gresham", "Hillsboro", "Bend", "Beaverton", "Medford", "Springfield", "Corvallis"],
    taxFree: true, // 免税州
    salesTaxRate: 0
  },
  {
    name: "Pennsylvania",
    abbreviation: "PA",
    coordinates: { lat: 40.590752, lng: -77.209755 },
    cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading", "Scranton", "Bethlehem", "Lancaster", "Harrisburg", "Altoona"],
    taxFree: false,
    salesTaxRate: 6.0
  },
  {
    name: "Rhode Island",
    abbreviation: "RI",
    coordinates: { lat: 41.680893, lng: -71.511780 },
    cities: ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence", "Woonsocket", "Newport", "Central Falls", "Westerly", "North Providence"],
    taxFree: false,
    salesTaxRate: 7.0
  },
  {
    name: "South Carolina",
    abbreviation: "SC",
    coordinates: { lat: 33.856892, lng: -80.945007 },
    cities: ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill", "Greenville", "Summerville", "Sumter", "Goose Creek", "Hilton Head Island"],
    taxFree: false,
    salesTaxRate: 6.0
  },
  {
    name: "South Dakota",
    abbreviation: "SD",
    coordinates: { lat: 44.299782, lng: -99.438828 },
    cities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown", "Mitchell", "Yankton", "Pierre", "Huron", "Vermillion"],
    taxFree: true, // 免税州（无个人所得税）
    salesTaxRate: 4.5
  },
  {
    name: "Tennessee",
    abbreviation: "TN",
    coordinates: { lat: 35.747845, lng: -86.692345 },
    cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville", "Murfreesboro", "Franklin", "Johnson City", "Bartlett", "Hendersonville"],
    taxFree: true, // 免税州（无个人所得税）
    salesTaxRate: 7.0
  },
  {
    name: "Texas",
    abbreviation: "TX",
    coordinates: { lat: 31.054487, lng: -97.563461 },
    cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Lubbock"],
    taxFree: true, // 免税州（无个人所得税）
    salesTaxRate: 6.25
  },
  {
    name: "Utah",
    abbreviation: "UT",
    coordinates: { lat: 40.150032, lng: -111.862434 },
    cities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "Sandy", "Ogden", "St. George", "Layton", "Taylorsville"],
    taxFree: false,
    salesTaxRate: 5.95
  },
  {
    name: "Vermont",
    abbreviation: "VT",
    coordinates: { lat: 44.045876, lng: -72.710686 },
    cities: ["Burlington", "Essex", "South Burlington", "Colchester", "Rutland", "Bennington", "Brattleboro", "Milton", "Hartford", "Barre"],
    taxFree: false,
    salesTaxRate: 6.0
  },
  {
    name: "Virginia",
    abbreviation: "VA",
    coordinates: { lat: 37.769337, lng: -78.169968 },
    cities: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria", "Hampton", "Portsmouth", "Suffolk", "Roanoke"],
    taxFree: false,
    salesTaxRate: 5.3
  },
  {
    name: "Washington",
    abbreviation: "WA",
    coordinates: { lat: 47.400902, lng: -121.490494 },
    cities: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent", "Everett", "Renton", "Federal Way", "Spokane Valley"],
    taxFree: true, // 免税州（无个人所得税）
    salesTaxRate: 6.5
  },
  {
    name: "West Virginia",
    abbreviation: "WV",
    coordinates: { lat: 38.491226, lng: -80.954570 },
    cities: ["Charleston", "Huntington", "Parkersburg", "Morgantown", "Wheeling", "Martinsburg", "Fairmont", "Beckley", "Clarksburg", "Lewisburg"],
    taxFree: false,
    salesTaxRate: 6.0
  },
  {
    name: "Wisconsin",
    abbreviation: "WI",
    coordinates: { lat: 44.268543, lng: -89.616508 },
    cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine", "Appleton", "Waukesha", "Oshkosh", "Eau Claire", "Janesville"],
    taxFree: false,
    salesTaxRate: 5.0
  },
  {
    name: "Wyoming",
    abbreviation: "WY",
    coordinates: { lat: 42.755966, lng: -107.302490 },
    cities: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs", "Sheridan", "Green River", "Evanston", "Riverton", "Jackson"],
    taxFree: true, // 免税州（无个人所得税）
    salesTaxRate: 4.0
  }
];
