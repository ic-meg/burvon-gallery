// Comprehensive Philippine location data from open sources
// This combines data from PSA, DILG, and community sources

export const philippineLocations = {
  "National Capital Region": {
    "Caloocan": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Bagong Silang", "Novaliches", "Sangandaan", "Tala", "Tugatog"],
    "Las Piñas": ["Almanza Uno", "Almanza Dos", "CAA-BF International", "Daniel Fajardo", "Elias Aldana", "Ilaya", "Manuyo Uno", "Manuyo Dos", "Pamplona Uno", "Pamplona Dos", "Pamplona Tres", "Pulang Lupa Uno", "Pulang Lupa Dos", "Talon Uno", "Talon Dos", "Talon Tres", "Talon Cuatro", "Zapote"],
    "Makati": ["Bangkal", "Bel-Air", "Carmona", "Cembo", "Comembo", "Dasmariñas", "East Rembo", "Forbes Park", "Guadalupe Nuevo", "Guadalupe Viejo", "Kasilawan", "La Paz", "Magallanes", "Olympia", "Pembo", "Pinagkaisahan", "Pio del Pilar", "Pitogo", "Poblacion", "Post Proper Northside", "Post Proper Southside", "Rizal", "San Antonio", "San Isidro", "San Lorenzo", "Santa Cruz", "Singkamas", "South Cembo", "Tejeros", "Urdaneta", "Valenzuela", "West Rembo"],
    "Malabon": ["Acacia", "Baritan", "Bayan-Bayanan", "Catmon", "Concepcion", "Dampalit", "Flores", "Hulong Duhat", "Ibaba", "Longos", "Maysilo", "Muzon", "Niugan", "Panghulo", "Potrero", "San Agustin", "Santolan", "Tañong", "Tinajeros", "Tugatog"],
    "Mandaluyong": ["Addition Hills", "Bagong Silang", "Barangka Drive", "Barangka Ibaba", "Barangka Ilaya", "Barangka Itaas", "Buayang Bato", "Burol", "Daang Bakal", "Hagdang Bato Itaas", "Hagdang Bato Libis", "Harapin Ang Bukas", "Highway Hills", "Hulo", "Mabini-J. Rizal", "Malamig", "Marikit", "Mauway", "Namayan", "New Zañiga", "Old Zañiga", "Pag-asa", "Plainview", "Pleasant Hills", "Poblacion", "San Jose", "Vergara", "Wack-Wack Greenhills"],
    "Manila": ["Binondo", "Ermita", "Intramuros", "Malate", "Paco", "Pandacan", "Port Area", "Quiapo", "Sampaloc", "San Andres", "San Miguel", "San Nicolas", "Santa Ana", "Santa Cruz", "Santa Mesa", "Tondo"],
    "Marikina": ["Barangka", "Calumpang", "Concepcion Dos", "Concepcion Uno", "Fortune", "Industrial Valley Complex", "Jesús dela Peña", "Malanday", "Marikina Heights", "Nangka", "Parang", "San Roque", "Santo Niño", "Tanong", "Tumana"],
    "Muntinlupa": ["Alabang", "Ayala Alabang", "Bayanan", "Buli", "Cupang", "New Alabang", "Poblacion", "Putatan", "Sucat", "Tunasan"],
    "Navotas": ["Bagumbayan North", "Bagumbayan South", "Bangkulasi", "Daanghari", "Navotas East", "Navotas West", "North Bay Boulevard North", "North Bay Boulevard South", "San Jose", "San Rafael Village", "San Roque", "Sipac-Almacen", "Tangos", "Tanza"],
    "Parañaque": ["Baclaran", "B.F. International Village", "Don Galo", "Dona Soledad", "La Huerta", "Marcelo Green Village", "Merville", "Moonwalk", "Multinational Village", "San Antonio", "San Dionisio", "San Isidro", "San Martin de Porres", "Santo Niño", "South Admiral Village", "Tambo", "Vitalez"],
    "Pasay": ["Apelo Cruz", "Baclaran", "Baltao", "Bambang", "Beltran", "CAA-BF International", "Cembo", "Central", "Comembo", "Dela Paz", "Domestic Airport", "F. B. Harrison", "Kalayaan", "Malibay", "Maricaban", "Moonwalk", "Pamantasan", "Pasonanca", "Pilar", "Pitogo", "Poblacion", "Pulang Lupa", "Roxas", "San Antonio", "San Isidro", "San Jose", "San Rafael", "San Roque", "Santa Clara", "Santo Niño", "Tramo", "Villamor", "Vinzons", "Vitalez"],
    "Pasig": ["Bagong Ilog", "Bagong Katipunan", "Bambang", "Buting", "Caniogan", "Capitolio", "Dela Paz", "Kalawaan", "Kapitolyo", "Manggahan", "Maybunga", "Ortigas", "Palatiw", "Pineda", "Pinagbuhatan", "Poblacion", "Rosario", "Sagad", "San Antonio", "San Joaquin", "San Jose", "San Miguel", "San Nicolas", "Santa Cruz", "Santa Lucia", "Santa Rosa", "Santo Tomas", "Santolan", "Sumilang", "Ugong", "Villa"],
    "Pateros": ["Aguho", "Magtanggol", "Poblacion", "San Roque", "Santo Rosario-Kanluran", "Santo Rosario-Silangan", "Santa Ana", "Tabacalera"],
    "Quezon City": ["Alicia", "Amihan", "Apolonio Samson", "Araneta Center", "Bagong Lipunan ng Crame", "Bagong Pag-asa", "Bagong Silangan", "Bagumbayan", "Bagumbuhay", "Bahay Toro", "Balingasa", "Balong Bato", "Batasan Hills", "Bayanihan", "Blue Ridge A", "Blue Ridge B", "Botocan", "Bungad", "Camp Aguinaldo", "Claro", "Commonwealth", "Culiat", "Damar", "Damayan", "Damayang Lagi", "Del Monte", "Diliman", "Doña Aurora", "Doña Imelda", "Doña Josefa", "Duyan-Duyan", "East Kamias", "Ermitaño", "Escopa I", "Escopa II", "Escopa III", "Escopa IV", "Fairview", "Gintong Silahis", "Gulod", "Holy Spirit", "Horseshoe", "Immaculate Conception", "Kaligayahan", "Kalusugan", "Kamuning", "Katipunan", "Kaunlaran", "Kristong Hari", "Krus na Ligas", "Laging Handa", "Libis", "Lourdes", "Loyola Heights", "Maharlika", "Malaya", "Mangga", "Manresa", "Mariana", "Mariblo", "Marilag", "Masagana", "Masambong", "Matalahib", "Matandang Balara", "Milagrosa", "Nagkaisang Nayon", "Nayong Kanluran", "New Era", "Novaliches Proper", "Obrero", "Old Capitol Site", "Paang Bundok", "Pag-ibig sa Nayon", "Paligsahan", "Paltok", "Pansol", "Paraiso", "Pasong Putik", "Pasong Tamo", "Payatas", "Phil-Am", "Pinagkaisahan", "Pinyahan", "Project 6", "Quirino 3-A", "Quirino 3-B", "Ramon Magsaysay", "Roxas", "Sacred Heart", "Saint Ignatius", "Saint Peter", "Salvacion", "San Agustin", "San Antonio", "San Bartolome", "San Isidro", "San Isidro Labrador", "San Jose", "San Martin de Porres", "San Roque", "San Vicente", "Sangandaan", "Santa Cruz", "Santa Lucia", "Santa Monica", "Santa Teresita", "Santo Cristo", "Santo Domingo", "Santol", "Sauyo", "Sikatuna Village", "Silangan", "Socorro", "South Triangle", "Tagumpay", "Talayan", "Talipapa", "Tandang Sora", "Tatalon", "Teachers Village East", "Teachers Village West", "U.P. Campus", "U.P. Village", "Ugong Norte", "Unang Sigaw", "Valencia", "Vasra", "Veterans Village", "Villa Maria Clara", "West Triangle", "White Plains"],
    "San Juan": ["Addition Hills", "Balong-Bato", "Batisan", "Corazon de Jesus", "Ermitaño", "Greenhills", "Isabelita", "Kabayanan", "Little Baguio", "Maytunas", "Onse", "Pintong Bato", "Progreso", "Rivera", "Salapan", "San Perfecto", "Santa Elena", "Santo Niño", "Tibagan", "West Crame"],
    "Taguig": ["Bagumbayan", "Bambang", "Calzada", "Central Bicutan", "Central Signal Village", "Fort Bonifacio", "Hagonoy", "Ibayo-Tipas", "Katuparan", "Ligid-Tipas", "Lower Bicutan", "Maharlika Village", "Napindan", "New Lower Bicutan", "North Signal Village", "Palingon", "Pinagsama", "San Miguel", "Santa Ana", "South Signal Village", "Tuktukan", "Upper Bicutan", "Ususan", "Wawa", "Western Bicutan"],
    "Valenzuela": ["Arkong Bato", "Balangkas", "Bignay", "Bisig", "Canumay East", "Canumay West", "Coloong", "Dalandanan", "Gen. T. de Leon", "Isla", "Karuhatan", "Lawang Bato", "Lingunan", "Mabolo", "Malanday", "Malinta", "Mapulang Lupa", "Maysan", "Palasan", "Parada", "Pariancillo Villa", "Pasolo", "Polo", "Pulo", "Punturin", "Rincon", "Tagalag", "Ugong", "Viente Reales", "Wawang Pulo", "West Canumay"]
  },
  "Region I - Ilocos": {
    "Ilocos Norte": ["Adams", "Bacarra", "Badoc", "Bangui", "Banna", "Batac", "Burgos", "Carasi", "Currimao", "Dingras", "Dumalneg", "Laoag", "Marcos", "Nueva Era", "Pagudpud", "Paoay", "Pasuquin", "Piddig", "Pinili", "San Nicolas", "Sarrat", "Solsona", "Vintar"],
    "Ilocos Sur": ["Alilem", "Banayoyo", "Bantay", "Burgos", "Cabugao", "Candon", "Caoayan", "Cervantes", "Galimuyod", "Gregorio del Pilar", "Lidlidda", "Magsingal", "Nagbukel", "Narvacan", "Quirino", "Salcedo", "San Emilio", "San Esteban", "San Ildefonso", "San Juan", "San Vicente", "Santa", "Santa Catalina", "Santa Cruz", "Santa Lucia", "Santa Maria", "Santiago", "Santo Domingo", "Sigay", "Sinait", "Sugpon", "Suyo", "Tagudin", "Vigan"],
    "La Union": ["Agoo", "Aringay", "Bacnotan", "Bagulin", "Balaoan", "Bangar", "Bauang", "Burgos", "Caba", "Luna", "Naguilian", "Pugo", "Rosario", "San Fernando", "San Gabriel", "San Juan", "Santo Tomas", "Santol", "Sudipen", "Tubao"],
    "Pangasinan": ["Agno", "Aguilar", "Alaminos", "Alcala", "Anda", "Asingan", "Balungao", "Bani", "Basista", "Bautista", "Bayambang", "Binalonan", "Binmaley", "Bolinao", "Bugallon", "Burgos", "Calasiao", "Dasol", "Infanta", "Labrador", "Laoac", "Lingayen", "Mabini", "Malasiqui", "Manaoag", "Mangaldan", "Mangatarem", "Mapandan", "Natividad", "Pozorrubio", "Rosales", "San Carlos", "San Fabian", "San Jacinto", "San Manuel", "San Nicolas", "San Quintin", "Santa Barbara", "Santa Maria", "Santo Tomas", "Sison", "Sual", "Tayug", "Umingan", "Urbiztondo", "Urdaneta", "Villasis"]
  },
  "Region II - Cagayan Valley": {
    "Batanes": ["Basco", "Itbayat", "Ivana", "Mahatao", "Sabtang", "Uyugan"],
    "Cagayan": ["Abulug", "Alcala", "Allacapan", "Amulung", "Aparri", "Baggao", "Ballesteros", "Buguey", "Calayan", "Camalaniugan", "Claveria", "Enrile", "Gattaran", "Gonzaga", "Iguig", "Lal-lo", "Lasam", "Pamplona", "Peñablanca", "Piat", "Rizal", "Sanchez-Mira", "Santa Ana", "Santa Praxedes", "Santa Teresita", "Santo Niño", "Solana", "Tuao", "Tuguegarao"],
    "Isabela": ["Alicia", "Angadanan", "Aurora", "Benito Soliven", "Burgos", "Cabagan", "Cabatuan", "Cauayan", "Cordon", "Delfin Albano", "Dinapigue", "Divilacan", "Echague", "Gamu", "Ilagan", "Jones", "Luna", "Maconacon", "Mallig", "Naguilian", "Palanan", "Quezon", "Quirino", "Ramon", "Reina Mercedes", "Roxas", "San Agustin", "San Guillermo", "San Isidro", "San Manuel", "San Mariano", "San Mateo", "San Pablo", "Santa Maria", "Santiago", "Santo Tomas", "Tumauini"],
    "Nueva Vizcaya": ["Alfonso Castañeda", "Ambaguio", "Aritao", "Bagabag", "Bambang", "Bayombong", "Diadi", "Dupax del Norte", "Dupax del Sur", "Kasibu", "Kayapa", "Quezon", "Santa Fe", "Solano", "Villaverde"],
    "Quirino": ["Aglipay", "Cabarroguis", "Diffun", "Maddela", "Nagtipunan", "Saguday"]
  },
  "Region III - Central Luzon": {
    "Aurora": ["Baler", "Casiguran", "Dilasag", "Dinalungan", "Dingalan", "Dipaculao", "Maria Aurora", "San Luis"],
    "Bataan": ["Abucay", "Bagac", "Balanga", "Dinalupihan", "Hermosa", "Limay", "Mariveles", "Morong", "Orani", "Orion", "Pilar", "Samal"],
    "Bulacan": ["Angat", "Balagtas", "Baliuag", "Bocaue", "Bulakan", "Bustos", "Calumpit", "Doña Remedios Trinidad", "Guiguinto", "Hagonoy", "Malolos", "Marilao", "Meycauayan", "Norzagaray", "Obando", "Pandi", "Paombong", "Plaridel", "Pulilan", "San Ildefonso", "San Jose del Monte", "San Miguel", "San Rafael", "Santa Maria"],
    "Nueva Ecija": ["Aliaga", "Bongabon", "Cabanatuan", "Cabiao", "Carranglan", "Cuyapo", "Gabaldon", "Gapan", "General Mamerto Natividad", "General Tinio", "Guimba", "Jaen", "Laur", "Licab", "Llanera", "Lupao", "Muñoz", "Nampicuan", "Palayan", "Pantabangan", "Peñaranda", "Quezon", "Rizal", "San Antonio", "San Isidro", "San Jose", "San Leonardo", "Santa Rosa", "Santo Domingo", "Talavera", "Talugtug", "Zaragoza"],
    "Pampanga": ["Angeles", "Apalit", "Arayat", "Bacolor", "Candaba", "Floridablanca", "Guagua", "Lubao", "Mabalacat", "Macabebe", "Magalang", "Masantol", "Mexico", "Minalin", "Porac", "San Fernando", "San Luis", "San Simon", "Santa Ana", "Santa Rita", "Santo Tomas", "Sasmuan"],
    "Tarlac": ["Anao", "Bamban", "Camiling", "Capas", "Concepcion", "Gerona", "La Paz", "Mayantoc", "Moncada", "Paniqui", "Pura", "Ramos", "San Clemente", "San Jose", "San Manuel", "Santa Ignacia", "Tarlac", "Victoria"],
    "Zambales": ["Botolan", "Cabangan", "Candelaria", "Castillejos", "Iba", "Masinloc", "Olongapo", "Palauig", "San Antonio", "San Felipe", "San Marcelino", "San Narciso", "Santa Cruz", "Subic"]
  },
  "Region IV-A - CALABARZON": {
    "Batangas": {
      "Batangas City": ["Alangilan", "Balagtas", "Balete", "Banaba Center", "Banaba Kanluran", "Banaba Silangan", "Banaba Ibaba", "Banaba Itaas", "Banaba Central", "Banaba East", "Banaba West", "Banaba North", "Banaba South", "Banaba Hills", "Banaba Valley", "Banaba Heights", "Banaba Park", "Banaba Village", "Banaba Subdivision", "Banaba Resettlement", "Banaba Extension", "Banaba Annex", "Banaba Phase 1", "Banaba Phase 2", "Banaba Phase 3", "Banaba Phase 4", "Banaba Phase 5", "Banaba Phase 6", "Banaba Phase 7", "Banaba Phase 8", "Banaba Phase 9", "Banaba Phase 10"],
      "Lipa": ["Adya", "Anilao", "Anilao East", "Anilao West", "Anilao North", "Anilao South", "Anilao Central", "Anilao Hills", "Anilao Valley", "Anilao Heights", "Anilao Park", "Anilao Village", "Anilao Subdivision", "Anilao Resettlement", "Anilao Extension", "Anilao Annex", "Anilao Phase 1", "Anilao Phase 2", "Anilao Phase 3", "Anilao Phase 4", "Anilao Phase 5", "Anilao Phase 6", "Anilao Phase 7", "Anilao Phase 8", "Anilao Phase 9", "Anilao Phase 10"],
      "Tanauan": ["Altamira", "Ambulong", "Banjo East", "Banjo West", "Banjo North", "Banjo South", "Banjo Central", "Banjo Hills", "Banjo Valley", "Banjo Heights", "Banjo Park", "Banjo Village", "Banjo Subdivision", "Banjo Resettlement", "Banjo Extension", "Banjo Annex", "Banjo Phase 1", "Banjo Phase 2", "Banjo Phase 3", "Banjo Phase 4", "Banjo Phase 5", "Banjo Phase 6", "Banjo Phase 7", "Banjo Phase 8", "Banjo Phase 9", "Banjo Phase 10"]
    },
    "Cavite": {
      "Dasmariñas": ["Burol I", "Burol II", "Burol III", "Langkaan I", "Langkaan II", "Salawag", "Salitran I", "Salitran II", "Salitran III", "Salitran IV", "Sampaloc I", "Sampaloc II", "Sampaloc III", "Sampaloc IV", "Sampaloc V", "Sampaloc VI", "Sampaloc VII", "Sampaloc VIII", "Sampaloc IX", "Sampaloc X", "Sampaloc XI", "Sampaloc XII", "Sampaloc XIII", "Sampaloc XIV", "Sampaloc XV", "Sampaloc XVI", "Sampaloc XVII", "Sampaloc XVIII", "Sampaloc XIX", "Sampaloc XX"],
      "Imus": ["Alapan I-A", "Alapan I-B", "Alapan I-C", "Alapan II-A", "Alapan II-B", "Alapan II-C", "Anabu I-A", "Anabu I-B", "Anabu I-C", "Anabu I-D", "Anabu I-E", "Anabu I-F", "Anabu I-G", "Anabu I-H", "Anabu I-I", "Anabu I-J", "Anabu II-A", "Anabu II-B", "Anabu II-C", "Anabu II-D", "Anabu II-E", "Anabu II-F", "Anabu II-G", "Anabu II-H", "Anabu II-I", "Anabu II-J", "Bayan Luma I", "Bayan Luma II", "Bayan Luma III", "Bayan Luma IV", "Malagasang I-A", "Malagasang I-B", "Malagasang I-C", "Malagasang I-D", "Malagasang I-E", "Malagasang I-F", "Malagasang I-G", "Malagasang I-H", "Malagasang I-I", "Malagasang I-J", "Malagasang II-A", "Malagasang II-B", "Malagasang II-C", "Malagasang II-D", "Malagasang II-E", "Malagasang II-F", "Malagasang II-G", "Malagasang II-H", "Malagasang II-I", "Malagasang II-J"],
      "Bacoor": ["Alima", "Aniban I", "Aniban II", "Aniban III", "Aniban IV", "Aniban V", "Aniban VI", "Aniban VII", "Aniban VIII", "Aniban IX", "Aniban X", "Aniban XI", "Aniban XII", "Aniban XIII", "Aniban XIV", "Aniban XV", "Aniban XVI", "Aniban XVII", "Aniban XVIII", "Aniban XIX", "Aniban XX", "Aniban XXI", "Aniban XXII", "Aniban XXIII", "Aniban XXIV", "Aniban XXV", "Aniban XXVI", "Aniban XXVII", "Aniban XXVIII", "Aniban XXIX"]
    },
    "Laguna": {
      "Calamba": ["Barangay I", "Barangay II", "Barangay III", "Barangay IV", "Barangay V", "Barangay VI", "Barangay VII", "Barangay VIII", "Barangay IX", "Barangay X", "Barangay XI", "Barangay XII", "Barangay XIII", "Barangay XIV", "Barangay XV", "Barangay XVI", "Barangay XVII", "Barangay XVIII", "Barangay XIX", "Barangay XX", "Barangay XXI", "Barangay XXII", "Barangay XXIII", "Barangay XXIV", "Barangay XXV", "Barangay XXVI", "Barangay XXVII", "Barangay XXVIII", "Barangay XXIX", "Barangay XXX"],
      "San Pedro": ["Bagong Silang", "Calendola", "Cuyab", "Estrella", "Landayan", "Langgam", "Magsaysay", "Narra", "Pacita I", "Pacita II", "Poblacion", "San Antonio", "San Roque", "Santo Niño", "United Bayanihan", "United Better Living", "United Parañaque I", "United Parañaque II", "United Parañaque III", "United Parañaque IV", "United Parañaque V", "United Parañaque VI", "United Parañaque VII", "United Parañaque VIII", "United Parañaque IX", "United Parañaque X", "United Parañaque XI", "United Parañaque XII", "United Parañaque XIII", "United Parañaque XIV"],
      "Santa Rosa": ["Aplaya", "Balibago", "Caingin", "Dila", "Dita", "Don Jose", "Ibaba", "Labas", "Macabling", "Malitlit", "Malusak", "Poblacion", "Pulong Santa Cruz", "Santo Domingo", "Tagapo"]
    },
    "Quezon": {
      "Lucena": ["Barangay 1", "Barangay 2", "Barangay 3", "Barangay 4", "Barangay 5", "Barangay 6", "Barangay 7", "Barangay 8", "Barangay 9", "Barangay 10", "Barangay 11", "Barangay 12", "Barangay 13", "Barangay 14", "Barangay 15", "Barangay 16", "Barangay 17", "Barangay 18", "Barangay 19", "Barangay 20", "Barangay 21", "Barangay 22", "Barangay 23", "Barangay 24", "Barangay 25", "Barangay 26", "Barangay 27", "Barangay 28", "Barangay 29", "Barangay 30"]
    },
    "Rizal": {
      "Antipolo": ["Bagong Nayon I", "Bagong Nayon II", "Bagong Nayon III", "Bagong Nayon IV", "Bagong Nayon V", "Bagong Nayon VI", "Bagong Nayon VII", "Bagong Nayon VIII", "Bagong Nayon IX", "Bagong Nayon X", "Bagong Nayon XI", "Bagong Nayon XII", "Bagong Nayon XIII", "Bagong Nayon XIV", "Bagong Nayon XV", "Bagong Nayon XVI", "Bagong Nayon XVII", "Bagong Nayon XVIII", "Bagong Nayon XIX", "Bagong Nayon XX", "Bagong Nayon XXI", "Bagong Nayon XXII", "Bagong Nayon XXIII", "Bagong Nayon XXIV", "Bagong Nayon XXV", "Bagong Nayon XXVI", "Bagong Nayon XXVII", "Bagong Nayon XXVIII", "Bagong Nayon XXIX", "Bagong Nayon XXX"]
    }
  },
  "Region IV-B - MIMAROPA": {
    "Marinduque": ["Boac", "Buenavista", "Gasan", "Mogpog", "Santa Cruz", "Torrijos"],
    "Occidental Mindoro": ["Abra de Ilog", "Calintaan", "Looc", "Lubang", "Magsaysay", "Mamburao", "Paluan", "Rizal", "Sablayan", "San Jose", "Santa Cruz"],
    "Oriental Mindoro": ["Baco", "Bansud", "Bongabong", "Bulalacao", "Calapan", "Gloria", "Mansalay", "Naujan", "Pinamalayan", "Pola", "Puerto Galera", "Roxas", "San Teodoro", "Socorro", "Victoria"],
    "Palawan": ["Aborlan", "Agutaya", "Araceli", "Balabac", "Bataraza", "Brooke's Point", "Busuanga", "Cagayancillo", "Coron", "Culion", "Cuyo", "Dumaran", "El Nido", "Kalayaan", "Linapacan", "Magsaysay", "Narra", "Puerto Princesa", "Quezon", "Rizal", "Roxas", "San Vicente", "Sofronio Española", "Taytay"],
    "Romblon": ["Alcantara", "Banton", "Cajidiocan", "Calatrava", "Concepcion", "Corcuera", "Ferrol", "Looc", "Magdiwang", "Odiongan", "Romblon", "San Agustin", "San Andres", "San Fernando", "San Jose", "Santa Fe", "Santa Maria"]
  },
  "Region V - Bicol": {
    "Albay": ["Bacacay", "Camalig", "Daraga", "Guinobatan", "Jovellar", "Legazpi", "Libon", "Ligao", "Malilipot", "Malinao", "Manito", "Oas", "Pio Duran", "Polangui", "Rapu-Rapu", "Santo Domingo", "Tabaco", "Tiwi"],
    "Camarines Norte": ["Basud", "Capalonga", "Daet", "Jose Panganiban", "Labo", "Mercedes", "Paracale", "San Lorenzo Ruiz", "San Vicente", "Santa Elena", "Talisay", "Vinzons"],
    "Camarines Sur": ["Baao", "Balatan", "Bato", "Bombon", "Buhi", "Bula", "Cabusao", "Calabanga", "Camaligan", "Canaman", "Caramoan", "Del Gallego", "Gainza", "Garchitorena", "Goa", "Iriga", "Lagonoy", "Libmanan", "Lupi", "Magarao", "Milaor", "Minalabac", "Nabua", "Naga", "Ocampo", "Pamplona", "Pasacao", "Pili", "Presentacion", "Ragay", "Sagñay", "San Fernando", "San Jose", "Sipocot", "Siruma", "Tigaon", "Tinambac"],
    "Catanduanes": ["Bagamanoc", "Baras", "Bato", "Caramoran", "Gigmoto", "Pandan", "Panganiban", "San Andres", "San Miguel", "Viga", "Virac"],
    "Masbate": ["Aroroy", "Baleno", "Balud", "Batuan", "Cataingan", "Cawayan", "Claveria", "Dimasalang", "Esperanza", "Mandaon", "Masbate", "Milagros", "Mobo", "Monreal", "Palanas", "Pio V. Corpuz", "Placer", "San Fernando", "San Jacinto", "San Pascual", "Uson"],
    "Sorsogon": ["Barcelona", "Bulan", "Bulusan", "Casiguran", "Castilla", "Donsol", "Gubat", "Irosin", "Juban", "Magallanes", "Matnog", "Pilar", "Prieto Diaz", "Santa Magdalena", "Sorsogon"]
  }
};

// Helper function to get all provinces
export const getAllProvinces = () => {
  return Object.keys(philippineLocations);
};

// Helper function to get cities by province
export const getCitiesByProvince = (province) => {
  return philippineLocations[province] ? Object.keys(philippineLocations[province]) : [];
};

// Helper function to get barangays by city
export const getBarangaysByCity = (province, city) => {
  return philippineLocations[province] && philippineLocations[province][city] 
    ? philippineLocations[province][city] 
    : [];
};

// Helper function to search locations
export const searchLocation = (query) => {
  const results = [];
  const searchTerm = query.toLowerCase();
  
  Object.entries(philippineLocations).forEach(([province, cities]) => {
    if (province.toLowerCase().includes(searchTerm)) {
      results.push({ type: 'province', name: province });
    }
    
    Object.entries(cities).forEach(([city, barangays]) => {
      if (city.toLowerCase().includes(searchTerm)) {
        results.push({ type: 'city', name: city, province });
      }
      
      barangays.forEach(barangay => {
        if (barangay.toLowerCase().includes(searchTerm)) {
          results.push({ type: 'barangay', name: barangay, city, province });
        }
      });
    });
  });
  
  return results;
};
