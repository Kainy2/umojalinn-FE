import {
  UmojaLinnFemaleSizingTemplateProps,
  UmojaLinnMaleSizingTemplateProps,
} from "@/types/project";

type FemaleSizingTemplateProp = {
  name: string;
  prop: keyof UmojaLinnFemaleSizingTemplateProps;
  img: string;
};
type MaleSizingTemplateProp = {
  name: string;
  prop: keyof UmojaLinnMaleSizingTemplateProps;
  img: string;
};

type AllSizingTemplateProp = {
  name: string;
  prop: keyof (UmojaLinnMaleSizingTemplateProps &
    UmojaLinnFemaleSizingTemplateProps);
  img: string;
};

export const FEMALE_SIZING_TEMPLATE: FemaleSizingTemplateProp[] = [
  {
    name: "Neck",
    prop: "neck",
    img: "/img/png/sizing-template/female/neck.png",
  },
  {
    name: "Bust",
    prop: "bust",
    img: "/img/png/sizing-template/female/bust.png",
  },
  {
    name: "Under Bust",
    prop: "underBust",
    img: "/img/png/sizing-template/female/underBust.png",
  },
  {
    name: "Waist",
    prop: "waist",
    img: "/img/png/sizing-template/female/waist.png",
  },
  {
    name: "Shoulder Width",
    prop: "shoulderWidth",
    img: "/img/png/sizing-template/female/shoulderWidth.png",
  },
  {
    name: "Shoulder to Nipple",
    prop: "shoulderToNipple",
    img: "/img/png/sizing-template/female/shoulderToNipple.png",
  },
  {
    name: "Shoulder to Underbust",
    prop: "shoulderToUnderBust",
    img: "/img/png/sizing-template/female/shoulderToUnderbust.png",
  },
  {
    name: "Shoulder to Waist",
    prop: "shoulderToWaist",
    img: "/img/png/sizing-template/female/shoulderToWaist.png",
  },
  {
    name: "Nipple to Nipple",
    prop: "nippleToNipple",
    img: "/img/png/sizing-template/female/nippleToNipple.png",
  },
  {
    name: "Back length",
    prop: "backLength",
    img: "/img/png/sizing-template/female/backLength.png",
  },
  {
    name: "Body rise",
    prop: "bodyRise",
    img: "/img/png/sizing-template/female/bodyRise.png",
  },
  {
    name: "Hips",
    prop: "hips",
    img: "/img/png/sizing-template/female/hips.png",
  },
  {
    name: "Armhole circumference",
    prop: "armHoleCircumference",
    img: "/img/png/sizing-template/female/armhole.png",
  },
  {
    name: "Biceps",
    prop: "bicep",
    img: "/img/png/sizing-template/female/bicep.png",
  },
  {
    name: "Wrist",
    prop: "wrist",
    img: "/img/png/sizing-template/female/wrist.png",
  },
  {
    name: "Desired Sleeve length",
    prop: "desiredSleeveLength",
    img: "/img/png/sizing-template/female/sleeveLength.png",
  },

  {
    name: "Desired Blouse / Top length",
    prop: "desiredBlouseOrTopLength",
    img: "/img/png/sizing-template/female/topLength.png",
  },
  {
    name: "Desired Dress length",
    prop: "desiredDressLength",
    img: "/img/png/sizing-template/female/dressLength.png",
  },

  {
    name: "Thigh",
    prop: "thigh",
    img: "/img/png/sizing-template/female/thigh.png",
  },

  {
    name: "Knee",
    prop: "knee",
    img: "/img/png/sizing-template/female/knee.png",
  },

  {
    name: "Calf",
    prop: "calf",
    img: "/img/png/sizing-template/female/calf.png",
  },

  {
    name: "Ankle",
    prop: "ankle",
    img: "/img/png/sizing-template/female/ankle.png",
  },

  {
    name: "Inseam",
    prop: "inseam",
    img: "/img/png/sizing-template/female/inseam.png",
  },

  {
    name: "Waist to Knee Point",
    prop: "waistToKneePoint",
    img: "/img/png/sizing-template/female/waistToKnee.png",
  },

  {
    name: "Desired Trouser / Skirt length",
    prop: "desiredTrouserOrSkirtLength",
    img: "/img/png/sizing-template/female/skirtLength.png",
  },
  {
    name: "Shoulder to Floor",
    prop: "shoulderToFloor",
    img: "/img/png/sizing-template/female/shoulderToFloor.png",
  },
  {
    name: "Height",
    prop: "height",
    img: "/img/png/sizing-template/female/height.png",
  },
  {
    name: "Head circumference",
    prop: "headCircumference",
    img: "/img/png/sizing-template/female/headCircumference.png",
  },
];

export const MALE_SIZING_TEMPLATE: MaleSizingTemplateProp[] = [
  {
    name: "Neck",
    prop: "neck",
    img: "/img/png/sizing-template/male/neck.png",
  },
  {
    name: "Chest",
    prop: "chest",
    img: "/img/png/sizing-template/male/chest.png",
  },
  {
    name: "Waist",
    prop: "waist",
    img: "/img/png/sizing-template/male/waist.png",
  },
  {
    name: "Shoulder Width",
    prop: "shoulderWidth",
    img: "/img/png/sizing-template/male/shoulderWidth.png",
  },
  {
    name: "Back length",
    prop: "backLength",
    img: "/img/png/sizing-template/male/backLength.png",
  },
  {
    name: "Body rise",
    prop: "bodyRise",
    img: "/img/png/sizing-template/male/bodyRise.png",
  },
  {
    name: "Hips",
    prop: "hips",
    img: "/img/png/sizing-template/male/hips.png",
  },
  {
    name: "Armhole circumference",
    prop: "armHoleCircumference",
    img: "/img/png/sizing-template/male/armHole.png",
  },
  {
    name: "Bicep",
    prop: "bicep",
    img: "/img/png/sizing-template/male/bicep.png",
  },
  {
    name: "Wrist",
    prop: "wrist",
    img: "/img/png/sizing-template/male/wrist.png",
  },
  {
    name: "Desired Sleeve length",
    prop: "desiredSleeveLength",
    img: "/img/png/sizing-template/male/desiredsleevelength.png",
  },

  {
    name: "Desired Shirt Length",
    prop: "desiredShirtLength",
    img: "/img/png/sizing-template/male/desiredShirtLength.png",
  },
  {
    name: "Desired Agbada Length",
    prop: "desiredAgbadaLength",
    img: "/img/png/sizing-template/male/desiredAgbadalength.png",
  },

  {
    name: "Thigh",
    prop: "thigh",
    img: "/img/png/sizing-template/male/thigh.png",
  },

  {
    name: "Knee",
    prop: "knee",
    img: "/img/png/sizing-template/male/knee.png",
  },

  {
    name: "Calf",
    prop: "calf",
    img: "/img/png/sizing-template/male/calf.png",
  },

  {
    name: "Ankle",
    prop: "ankle",
    img: "/img/png/sizing-template/male/ankle.png",
  },

  {
    name: "Inseam",
    prop: "inseam",
    img: "/img/png/sizing-template/male/inseam.png",
  },

  {
    name: "Waist to Knee Point",
    prop: "waistToKneePoint",
    img: "/img/png/sizing-template/male/waistToKneePoint.png",
  },

  {
    name: "Desired Trouser Length",
    prop: "desiredTrouserOrSkirtLength",
    img: "/img/png/sizing-template/male/trouserLength.png",
  },

  {
    name: "Shoulder to Floor",
    prop: "shoulderToFloor",
    img: "/img/png/sizing-template/male/shouldertoFloor.png",
  },

  {
    name: "Height",
    prop: "height",
    img: "/img/png/sizing-template/male/Height.png",
  },
  {
    name: "Head circumference",
    prop: "headCircumference",
    img: "/img/png/sizing-template/male/HeadCircumference.png",
  },
];

// @ts-expect-error Fix type
export const ALL_SIZING_TEMPLATES: AllSizingTemplateProp[] =
  MALE_SIZING_TEMPLATE?.reduce(
    (prev, curr) =>
      // @ts-expect-error Fix type
      prev?.find((template) => template?.prop === curr?.prop)
        ? prev
        : [...prev, curr],
    FEMALE_SIZING_TEMPLATE,
  );
