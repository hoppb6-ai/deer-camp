'use strict';
/* Seed data: copied from Brandon's "Deer season" chat and its "Kalkaska Deer Camp 2026" page.
 * Prices were checked November 16, 2026 (America/Detroit). Tax and shipping not included.
 * Left out on purpose for a public site: family members' names, any addresses or GPS points. */
const SEED_VERSION=1;
const L={
 cctTent:'https://www.canvascampingtents.com/12x16-cabin-lodge-tent-sr-stove-ready.html',
 cctRoom:'https://www.canvascampingtents.com/1672-kodiak-awning-room-add-on-for-the-kodiak-lodge.html',
 bundle:'https://kodiakcanvas.com/products/12x16-cabin-lodge-and-stove-bundle',
 spruce:'https://www.competitiveedgeproducts.com/spruce-stove-package.html',
 timber:'https://www.competitiveedgeproducts.com/colorado-cylinder-4046-timberline-stove-package.html',
 alpine:'https://www.sportsmans.com/camping-gear-supplies/tents-shelters/tent-accessories/camp-chef-alpine-heavy-duty-cylinder-stove/p/1366789',
 mat:'https://kodiakcanvas.com/products/tent-stove-heat-shield-mat',
 pipe:'https://kodiakcanvas.com/products/5-stove-pipe-1'
};
function seedData(){
 let n=0;const id=p=>p+(++n);
 const buy=(group,name,where,price,qty,url,note,pick=false)=>({id:id('b'),group,name,where,price,qty,url,note,pick,bought:false});
 const gear=(group,name,note='')=>({id:id('g'),group,name,note,done:false});
 return{
  seedVersion:SEED_VERSION,lastBackup:null,
  camp:{where:'Public land near Kalkaska, MI',base:"Mom and Dad's house in Kalkaska",spot:'Still to be named',days:'Two hunt days, opener weekend 2026',next:''},
  crew:[
   {id:id('c'),name:'Brandon',role:'Guide and camp cook',note:'Came up from Grand Rapids with Shehan.'},
   {id:id('c'),name:'Jeremy "Beans"',role:"Brandon's oldest friend",note:'Friends since they were about 10. Brought the pop-up blind and the Buddy heater.'},
   {id:id('c'),name:'Shehan',role:'Chef Shehan',note:'Buddy since 2014 (met at GVSU). Hunted the area with Brandon last season. A firm, no-nonsense chef who runs a tight steak operation.'}
  ],
  buy:[
   buy('Kodiak plan (current)','Kodiak Canvas 12x16 Cabin Lodge Tent SR, model 6116','Canvas Camping Tents',1399.99,1,L.cctTent,'Main sleeping tent. In stock, free shipping, and a free 12x16 ground tarp ($59.99 value). Same price at Competitive Edge, Amazon, Kodiak (backordered), and Sportsman\'s Warehouse (out of stock).',true),
   buy('Kodiak plan (current)','Kodiak Enclosed Awning (front room), model 1672','Canvas Camping Tents',499.99,1,L.cctRoom,'Official 8x8 front room for the 6116. No floor; sod cloth seals the bottom. Packs at 43 lb. Same price, in stock at Competitive Edge and Amazon.',true),
   buy('Stove options (on hold)','Colorado Cylinder Spruce stove package, model 4023 (mid pick)','Competitive Edge',429.99,1,L.spruce,'Kodiak-approved for this tent. 5-inch pipe, 1.6 cu ft firebox. Includes about 8 ft of nested pipe, spark arrestor, damper, grate, legs, warming rack, poker.'),
   buy('Stove options (on hold)','Colorado Cylinder Timberline stove package, model 4046','Competitive Edge',499.99,1,L.timber,'Next size up from the Spruce if you want more heat. Kodiak minimum tent size is 12x16.'),
   buy('Stove options (on hold)','Camp Chef Alpine CS14 (budget pick)','Sportsman\'s Warehouse',279.99,1,L.alpine,'Sale price, was $349.99. Includes 10 ft nesting pipe, damper, spark arrestor. Not on Kodiak\'s approved list, so keep the pipe under 500 F.'),
   buy('Stove options (on hold)','Kodiak Canvas stove mat, model 1577','Kodiak Canvas',49.99,1,L.mat,'Needed if you add a stove. 36 x 54 in. Backordered at Kodiak; $54.99 and in stock at Canvas Camping Tents.'),
   buy('Stove options (on hold)','Kodiak 5-inch telescoping stove pipe (spare)','Kodiak Canvas',79.99,1,L.pipe,'Optional backup. Both stove packages already include enough pipe for the 7.5 ft peak.'),
   buy('Stove options (on hold)','Kodiak 12x16 cabin, awning, stove, mat, and ground tarp bundle','Kodiak Canvas',2269.99,1,L.bundle,'Was $2,389.95. The better mid-range buy if it is actually in stock.'),
   buy('Dream camp: wall tent and living','Elk Mountain 13x16 wall tent, PolyShield+','Elk Mountain',1349,1,'https://elkmountaintents.com/product/canvas-wall-tent-w-angle-kit/','Fire-resistant for Michigan. PolyShield without the plus is $1,150.'),
   buy('Dream camp: wall tent and living','Elk Mountain 1-inch angle kit','Elk Mountain',200,1,'https://elkmountaintents.com/product/premium-angles/','Listed as a $200–$300 range.'),
   buy('Dream camp: wall tent and living','Elk Mountain 1-inch frame and poles','Elk Mountain',595,1,'https://elkmountaintents.com/product/1-steel-complete-tent-frames-poles','Listed as a $595–$695 range.'),
   buy('Dream camp: wall tent and living','20x30 heavy-duty poly tarp (floor)','Tractor Supply',58.49,1,'https://www.tractorsupply.com/tsc/product/mutual-industries-heavy-duty-poly-tarp-20-ft-x-30-ft-2367508','Sale price, was $64.99. Comfortable pick: Elk Mountain tie-in floor, $195–$275.'),
   buy('Dream camp: wall tent and living','Davis Summit Ridge wood stove package','Davis Tent',559,1,'https://www.davistent.com/product/wood-burning-camp-stove/','For 12x15 through 14x15 tents. Peak package is $605.'),
   buy('Dream camp: wall tent and living','Teton Sports Outfitter XXL cot','Cabela\'s',199.99,3,'https://www.cabelas.com/p/teton-sports-outfitter-xxl-camping-cot-with-patented-pivot-arm','86 x 45 in, 600 lb rating. One per guy.'),
   buy('Dream camp: wall tent and living','Lifetime 6-ft nesting folding table','Tractor Supply',97.99,1,'https://www.tractorsupply.com/tsc/product/lifetime-6-ft-nesting-folding-table-80306-1611299','Sale price, was $139.99. Card table.'),
   buy('Dream camp: wall tent and living','GCI Outdoor Freestyle Rocker','Cabela\'s',80,4,'https://www.cabelas.com/p/gci-outdoor-freestyle-rocker-camp-chair','Three for the crew plus one extra.'),
   buy('Dream camp: wall tent and living','Plano Sportsman\'s Tote 108-qt','Cabela\'s',39.99,3,'https://www.cabelas.com/p/plano-sportsmans-tote','Lockable locker totes for the front area.'),
   buy('Dream camp: wall tent and living','Cabela\'s propane lantern combo','Cabela\'s',34.99,2,'https://www.cabelas.com/p/cabelas-propane-lantern-combo','810 lumens, 16.4 oz cylinders not included.'),
   buy('Dream camp: kitchen and screen','Davis Cook Shack 14x10, fire-treated, with angle kit','Davis Tent',1266,1,'https://www.davistent.com/product/cook-shack/','Comfortable pick. Canvas only is $1,086.'),
   buy('Dream camp: kitchen and screen','Unique UGP-3 3 cu ft propane fridge','The Cabin Depot',1399,1,'https://thecabindepot.com/products/unique-3-cu-ft-fridge-with-freezer-black','Propane, 110V, or 12V. About 0.7 lb propane a day.'),
   buy('Dream camp: kitchen and screen','Camp Chef PRO 14 two-burner cooking system','Camp Chef',379.99,1,'https://www.campchef.com/products/pro-14','Two 30,000 BTU burners. The stove and range.'),
   buy('Dream camp: kitchen and screen','Lifetime 6-ft folding picnic table','Tractor Supply',223.99,1,'https://www.tractorsupply.com/tsc/product/lifetime-6-foot-folding-picnic-table-brown-1276855','Sale price, was $319.99. Seats 8.'),
   buy('Dream camp: kitchen and screen','Clam Quick-Set Escape 11.5x11.5 screen tent','Clam Outdoors',369.99,1,'https://clamoutdoors.com/products/escape-screen-tent','Screened picnic area.'),
   buy('Dream camp: kitchen and screen','Flame King 20 lb propane tank (empty)','Ace Hardware',64.99,2,'https://www.acehardware.com/departments/outdoor-living/grills-and-smokers/propane-cylinders-and-accessories/8039929','Fill cost not included.'),
   buy('Dream camp: kitchen and screen','Camp Chef 8-ft RV propane hose','Camping World',59.99,1,'https://www.campingworld.com/camp-chef-rv-propane-connection-hose-66677.html','Page also showed a $36.08 clearance price.'),
   buy('Dream camp: gear tent, buck pole, well, toilet, fire','Kodiak Canvas stove-ready 10x10 Cabin Lodge (gear tent)','Cabela\'s',849.99,1,'https://www.cabelas.com/p/kodiak-canvas-stove-ready-6-person-cabin-lodge-tent-101639765','For outer shells, scents, and cover-up spray.'),
   buy('Dream camp: gear tent, buck pole, well, toilet, fire','HME hitch hoist with swivel and gambrel (buck pole)','Cabela\'s',169.99,1,'https://www.cabelas.com/p/hme-hitch-hoist-with-swivel-and-gambrel','400 lb capacity, hangs off a hitch.'),
   buy('Dream camp: gear tent, buck pole, well, toilet, fire','Heavy-duty pitcher pump and sand-point kit','Well WaterBoy',242,1,'https://waterbuckpump.com/heavy-duty-pitcher-pump-sand-point-kit/','For shallow water 25 ft or less. Belongs on land you control, not state public land.'),
   buy('Dream camp: gear tent, buck pole, well, toilet, fire','1-1/4 in x 5-ft galvanized drive pipe','Dean Bennett Supply',54.56,6,'https://deanbennettsupply.com/products/47222/1-1-4-x-5-Galvanized-Steel-Drive-Pipe-TBE','About 30 ft of drive pipe.'),
   buy('Dream camp: gear tent, buck pole, well, toilet, fire','Thetford Porta Potti 135','Cabela\'s',134.99,1,'https://www.cabelas.com/p/thetford-porta-potti-135','Basic toilet. Comfortable pick: Nature\'s Head, $965.'),
   buy('Dream camp: gear tent, buck pole, well, toilet, fire','Stansport pop-up privacy shelter','Cabela\'s',62.99,1,'https://www.cabelas.com/p/stansport-pop-up-privacy-shelter','Sale price, was $69.99.'),
   buy('Dream camp: gear tent, buck pole, well, toilet, fire','Fire Horse 36-inch galvanized fire ring','Tractor Supply',64.99,1,'https://www.tractorsupply.com/tsc/product/fire-horse-36-in-galvanized-fire-ring-6182087','Easy to haul.'),
   buy('Dream camp: trailer','5x8 Interstate Patriot enclosed cargo trailer','TrailersPlus Wayland',2759,1,'https://www.trailersplus.com/Michigan/Wayland/inventory/Cargo/','Basic pick. Before tax, title, and registration.'),
   buy('Dream camp: trailer','6x10 Interstate Victory enclosed cargo trailer','TrailersPlus Wayland',3999,1,'https://www.trailersplus.com/Michigan/Wayland/inventory/Cargo/','Comfortable pick. 6x10 LoadRunner units were $4,999 to $5,059.')
  ],
  gear:[
   gear('Blind and stand','Pop-up ground blind','Beans brought it in 2026'),
   gear('Blind and stand','Reflective tacks','Used to mark the blind tree'),
   gear('Blind and stand','Chairs'),
   gear('Heat','Buddy heater'),
   gear('Heat','Propane'),
   gear('Heat','Check the heater fuel hose is fully seated before lighting','2026: a loose hose set the heater on fire'),
   gear('Rifle and range','Savage .308 (Beans\')'),
   gear('Rifle and range','Ammunition'),
   gear('Rifle and range','Targets'),
   gear('Scents','Fox urine'),
   gear('Scents','Doe urine and diffuser','Don\'t overfill it (ask Beans)'),
   gear('Camp','Kodiak 12x16 Cabin Lodge SR tent'),
   gear('Camp','Kodiak 1672 front room'),
   gear('Camp','12x16 ground tarp','Free with the tent at Canvas Camping Tents')
  ],
  log:[
   {id:id('l'),date:'2026-11-13',title:'Arrival',text:'Beans got to Kalkaska first, about half an hour ahead of everyone else. Mom and Dad were both out of town, so he called Dad, found the house key, and let himself in.\n\nNext door, Brandon\'s brother-in-law had no idea anyone was coming. He spotted a Bronco he didn\'t recognize in the driveway and went over to deal with the intruder. It ended in a big laugh once he found out the would-be burglar was just Beans.\n\nBrandon and Shehan rolled in from Grand Rapids around 1 pm and unloaded their gear.'},
   {id:id('l'),date:'2026-11-13',title:'Staging the spot',text:'All three headed out to the spot to stage gear and get a feel for the area. Last season Brandon and Shehan hunted near here out of Dad\'s brush blind. This year Beans brought his pop-up blind and Buddy heater, so camp is pure luxury by comparison.\n\nBeans found a climbing tree stand sitting at the base of a tree nearby. The crew agreed only an idiot would leave gear that expensive on public land, so they let it be.\n\nBrandon marked the ground blind tree with a reflective tack. The propane, chairs, heater, and pop-up blind went into Dad\'s brush blind nearby for safekeeping.'},
   {id:id('l'),date:'2026-11-13',title:'Camp night',text:'Back at the house, the crew cracked a bottle of Four Roses and opened the 30 rack of Busch Light. Camp cook Brandon made burgers and bacon. After that everyone settled into Dad\'s cigar lounge to catch up over some drinky poohs.'},
   {id:id('l'),date:'2026-11-14',title:'Supply run and sighting in',text:'Up around 8. Brandon made eggs, breakfast sausage, and buttered toast.\n\nAround 11 they drove to Cadillac for ammunition, targets, and fox urine. Then on to the Supply Road DNR gun range to sight in Beans\' Savage .308 for Shehan. They met a fellow hunter there named Daniel.'},
   {id:id('l'),date:'2026-11-14',title:'Small game and steak night',text:'Back in Kalkaska around 2. Shehan scoped out Skegemog Lake while Beans and Brandon relaxed at home.\n\nThe small game competition got going with Dad\'s pellet rifle. Shehan drew first blood with a squirrel, Brandon took second, and Beans sat in sad last place. Beans found the rifle wasn\'t sighted in and fixed it. Brandon spotted a rabbit in the backyard and Shehan made a perfect shot. The crew named it Jorge, and Brandon joked that Shehan had killed Dad\'s rabbit. Shehan skinned, gutted, and rinsed it in a bucket from the shed, which set off a heated debate over the best rinsing method. Brandon showed the guys how to process a carcass into freezer-ready meat.\n\nDinner was steaks and mac, with steaks from the cow Beans just bought. Brandon prepped and Chef Shehan grilled them to perfection. Four Roses and a fight on Paramount+ until midnight. Brandon was first asleep.'},
   {id:id('l'),date:'2026-11-15',title:'Opening day',text:'Left camp later than planned, tired and hungover. A small incident with the blind, panic ensued, Brandon solved it and the blind was set.\n\nAnother hunter fired at 7:14 am. Shot-time guesses: Beans 7:21 (closest), Shehan 7:35, Brandon 7:45.\n\nAround 9 the heater caught fire because the fuel hose wasn\'t fully seated. Beans lifted the whole ground blind up and away from the flames. Brandon shut off the valve, found the failure, and fixed it.\n\nAround 1:30 pm Beans walked about 50 yards out to set up a doe urine diffuser, overfilled it, and got doe piss all over his glasses and face. Around 2:30 pm Beans finally shot a chipmunk.\n\nSat until dark. No deer seen or heard, just other hunters\' shots.'},
   {id:id('l'),date:'2026-11-15',title:'Camp night',text:'Mom was back from her trip; dinner was hot dogs. Beans went to bed around 10. Brandon and Shehan had a heated debate about whether refilling 1 lb propane cylinders is worth it, and turned in around 11:30.'},
   {id:id('l'),date:'2026-11-16',title:'Final day',text:'Up at 4, out of camp at 5, at the spot just before 6. One shot rang out in the dark at 6:55.\n\nThe crew sat the blind until exactly 11, then called it since everyone had work the next day. All three were headed home by 1:30.'}
  ],
  tally:['Deer seen: none','Small game: Shehan, a squirrel and a rabbit (Jorge); Brandon, second place; Beans, a chipmunk on Sunday','Shot-time guessing champ: Beans, 7 minutes off on Sunday','Heater fires: one, extinguished (loose fuel hose)','Doe piss facials: one (Beans)'],
  dream:['Wall tent with a stove, cots, a card table and chairs, and a small front area with a locker spot for each guy','Attached kitchen tent with everything on gas: fridge, stove, and range','Screened-in picnic table next to or attached to the kitchen','Gear and hunting tent for outer shells, scents, and cover-up spray','Buck pole','Dry point well','A good shitter','Fire pit','Small trailer to store and haul all the gear'].map(t=>({id:id('d'),text:t,done:false})),
  notes:''
 };
}
const INFO=[
 ['Kodiak 12x16 Cabin Lodge SR (6116)','Largest stove-ready Cabin Lodge. Factory 5-inch stove jack with zip cover, sewn-in 13.5 oz vinyl floor, 1-inch galvanized steel frame. Peak 7.5 ft, side walls 4 ft. About 120 lb packed (tent 65 lb, poles and stakes 55 lb). Rated 10 people, or 8 with a stove.'],
 ['Canvas is not fire-retardant','The Hydra-Shield cotton duck can burn. Michigan exempts recreational camping tents from fire-resistance rules, so it is legal here. With a stove: use a stove mat, keep the jack flap secured, and don\'t run the stove red-hot.'],
 ['Front room (1672)','Kodiak confirms it fits the 6116, and you can add one at each end. Roof alone works as an awning, or zip on the walls for an enclosed room with six windows. The Flex-Bow wing vestibule does not fit this tent.'],
 ['Why not the 10x10','Only 100 sq ft. Three XXL cots (86 x 45 in) take close to 80 sq ft before a stove and its clearance.'],
 ['Where a standing camp can go','A driven sand-point well and a standing wall-tent camp belong on private or leased land you control, not state public land near Kalkaska.'],
 ['Davis Tent and Michigan','Davis Tent will not ship to Michigan without fire treatment, so those prices are the fire-treated versions.'],
 ['Dream camp totals (checked Nov 16, 2026)','Basic kit about $9,745; comfortable kit about $14,942; near $16,000 with a 6x10 LoadRunner trailer. Before tax, shipping, title, and propane fills.']
];
