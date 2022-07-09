const Delay = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
const peds: number[] = [];
let deadCount: number = 0;
let warFlag: boolean = true;

RegisterCommand(
  "war",
  async (source: number, args: string[], rawCommand: string) => {
    if (warFlag) {
      warFlag = false;
      SetEntityCoords(
        GetPlayerPed(-1),
        135.733,
        -749.216,
        258.152,
        true,
        false,
        false,
        true
      );
      SetPedCanSwitchWeapon(PlayerPedId(), false);
      for (let i = 0; i < 9; i++) {
        await spawnNpcs();
      }
      const checkIfKilledNpcInterval = setInterval(() => {
        const deadOrNot = peds.map((ped) => {
          if (IsPedDeadOrDying(ped, false)) {
            return 1;
          }
          return 0;
        });
        const numOfDead = deadOrNot.reduce((sum: number, a) => sum + a, 0);
        if (numOfDead > deadCount) {
          deadCount++;
          if (deadCount === 10) {
            SetPedCanSwitchWeapon(PlayerPedId(), true);
            removeCurrentGun();
            clearInterval(checkIfKilledNpcInterval);
            warFlag = true;
            console.log("war is over");
            return;
          }
          removeCurrentGun();
          giveRandomGun();
        }
      }, 100);
    } else {
      console.log("war is already in progress");
    }
  },
  false
);
const spawnNpcs = async () => {
  const [x, y, z] = GetEntityCoords(PlayerPedId(), true);
  const modelHash = GetHashKey("a_f_y_beach_01");
  RequestModel(modelHash);
  while (!HasModelLoaded(modelHash)) await Delay(100);
  const res = CreatePed(1, modelHash, x + 3, y + 3, z, 0, true, true);
  console.log(res);
  if (res) peds.push(res);
};

const removeCurrentGun = () => {
  const [retval, weaponHash]: [boolean, number] = GetCurrentPedWeapon(
    GetPlayerPed(-1),
    true
  );
  RemoveWeaponFromPed(GetPlayerPed(-1), weaponHash);
};

const giveRandomGun = () => {
  const modelHashes = [
    -1121678507, 487013001, 2017895192, -494615257, -275439685, -952879014,
    1119849093, 1627465347,
  ];
  const getGunIndex = () => {
    //For the gun not to repeat:
    const [retval, weaponHash]: [boolean, number] = GetCurrentPedWeapon(
      GetPlayerPed(-1),
      true
    );
    modelHashes.indexOf(weaponHash);
    let index = Math.floor(modelHashes.length * Math.random());
    if (
      modelHashes[index] === modelHashes.indexOf(weaponHash) &&
      index > 0 &&
      index < modelHashes.length - 1
    ) {
      index = Math.round(Math.random()) ? index + 1 : index - 1;
    } else if (index === 0) {
      index++;
    } else {
      index--;
    }
    return index;
  };
  //
  GiveWeaponToPed(GetPlayerPed(-1), modelHashes[getGunIndex()], 5, false, true);
};

emit("chat:addSuggestion", "/war", "war", [
  {
    help: "create a npc filled room for a gun game mode every time you kill a new npc, you get a new weapon",
  },
]);

// Stuff I was trying out during development
// RegisterCommand(
//   "createveh",
//   async (source: number, args: string[], rawCommand: string) => {
//     const [model] = args;
//     const modelHash = GetHashKey(model);

//     if (!IsModelInCdimage(modelHash)) return;

//     RequestModel(modelHash);
//     while (!HasModelLoaded(modelHash)) await Delay(100);

//     const [x, y, z] = GetEntityCoords(PlayerPedId(), true);
//     const h = GetEntityHeading(PlayerPedId());
//     const veh = CreateVehicle(modelHash, x, y, z, h, true, true);

//     while (!DoesEntityExist(veh)) await Delay(100);

//     SetPedIntoVehicle(PlayerPedId(), veh, -1);
//   },
//   false
// );

// emit("chat:addSuggestion", "/createveh", "spawn a car", [
//   {
//     name: "Model",
//     help: "Vehicle spawn code",
//   },
// ]);

// RegisterCommand(
//   "givemerandomgun",
//   async (source: number, args: string[], rawCommand: string) => {
//     // const [model] = args
//     // const modelHash = GetHashKey(model)
//     SetPedCanSwitchWeapon(PlayerPedId(), false);
//     const modelHashes = [-1121678507, 487013001, 2017895192, -494615257];
//     console.log("giving weapon");
//     GiveWeaponToPed(
//       GetPlayerPed(-1),
//       modelHashes[Math.floor(modelHashes.length * Math.random())],
//       5,
//       false,
//       true
//     );
//   },
//   false
// );

// emit("chat:addSuggestion", "/givemerandomgun", "give you a gun", [
//   {
//     help: "Give me random gun",
//   },
// ]);

// RegisterCommand(
//   "peds",
//   async (source: number, args: string[], rawCommand: string) => {
//     console.log(
//       peds.map((ped) => {
//         return IsPedDeadOrDying(ped, false);
//       })
//     );
//   },
//   false
// );

// emit("chat:addSuggestion", "/peds", "spawnped", [
//   {
//     help: "spawn ped",
//   },
// ]);

// RegisterCommand(
//   "removecurrentgun",
//   async (source: number, args: string[], rawCommand: string) => {
//     const [retval, weaponHash]: [boolean, number] = GetCurrentPedWeapon(
//       GetPlayerPed(-1),
//       true
//     );
//     console.log("removing weapon");
//     RemoveWeaponFromPed(GetPlayerPed(-1), weaponHash);
//   },
//   false
// );

// emit("chat:addSuggestion", "/removecurrentgun", "remove your gun", [
//   {
//     help: "Remove current gun",
//   },
// ]);

// RegisterCommand(
//   "spawnped",
//   async (source: number, args: string[], rawCommand: string) => {
//     const [x, y, z] = GetEntityCoords(PlayerPedId(), true);
//     const modelHash = GetHashKey("a_f_y_beach_01");
//     RequestModel(modelHash);
//     while (!HasModelLoaded(modelHash)) await Delay(100);
//     const res = CreatePed(1, modelHash, x + 3, y + 3, z, 0, true, true);
//     console.log(res);
//     if (res) peds.push(res);
//     console.log(peds);
//   },
//   false
// );

// emit("chat:addSuggestion", "/spawnped", "spawnped", [
//   {
//     help: "spawn ped",
//   },
// ]);
