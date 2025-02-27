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
    name: "Height",
    prop: "height",
    img: "/img/png/sizing-template/female/female_1.png",
  },
  {
    name: "Neck Circumference",
    prop: "neckCircumference",
    img: "/img/png/sizing-template/female/female_2.png",
  },
  {
    name: "Total bust",
    prop: "totalBust",
    img: "/img/png/sizing-template/female/female_3.png",
  },
  {
    name: "Highest point of hips",
    prop: "highestPointOfHips",
    img: "/img/png/sizing-template/female/female_4.png", // Incorrect
  },
  {
    name: "Widest point of hips",
    prop: "widestPointOfHips",
    img: "/img/png/sizing-template/female/female_11.png",
  },
  {
    name: "Thigh",
    prop: "thigh",
    img: "/img/png/sizing-template/female/female_4.png",
  },
  {
    name: "Upper arm Circumference",
    prop: "upperArmCircumference",
    img: "/img/png/sizing-template/female/female_5.png",
  },
  {
    name: "Arm Length",
    prop: "armLength",
    img: "/img/png/sizing-template/female/female_6.png",
  },
  {
    name: "Shoulder width",
    prop: "shoulderWidth",
    img: "/img/png/sizing-template/female/female_7.png",
  },
  {
    name: "Body rise",
    prop: "bodyRise",
    img: "/img/png/sizing-template/female/female_8.png",
  },
  {
    name: "Neck to ankle",
    prop: "neckToAnkle",
    img: "/img/png/sizing-template/female/female_9.png",
  },
  {
    name: "Waist",
    prop: "waist",
    img: "/img/png/sizing-template/female/female_10.png",
  },
  {
    name: "Inseam",
    prop: "inseam",
    img: "/img/png/sizing-template/female/female_12.png",
  },
  {
    name: "Back length",
    prop: "backLength",
    img: "/img/png/sizing-template/female/female_13.png",
  },
  {
    name: "Outseam",
    prop: "outseam",
    img: "/img/png/sizing-template/female/female_14.png",
  },
  {
    name: "Ankle circumference",
    prop: "ankleCircumference",
    img: "/img/png/sizing-template/female/female_15.png",
  },
  {
    name: "Calf circumference",
    prop: "calfCircumference",
    img: "/img/png/sizing-template/female/female_16.png",
  },
  {
    name: "Wrist circumference",
    prop: "wristCircumference",
    img: "/img/png/sizing-template/female/female_17.png",
  },
  {
    name: "Waist to floor",
    prop: "waistToFloor",
    img: "/img/png/sizing-template/female/female_18.png",
  },
];

export const MALE_SIZING_TEMPLATE: MaleSizingTemplateProp[] = [
  {
    name: "Height",
    prop: "height",
    img: "/img/png/sizing-template/male/male_1.png",
  },
  {
    name: "Neck Circumference",
    prop: "neckCircumference",
    img: "/img/png/sizing-template/male/male_2.png",
  },
  {
    name: "Shoulder width",
    prop: "shoulderWidth",
    img: "/img/png/sizing-template/male/male_3.png",
  },
  {
    name: "Upper Chest Circumference",
    prop: "upperChestCircumference",
    img: "/img/png/sizing-template/male/male_4.png",
  },
  {
    name: "Chest Circumference",
    prop: "chestCircumference",
    img: "/img/png/sizing-template/male/male_5.png",
  },
  {
    name: "Upper arm Circumference",
    prop: "upperArmCircumference",
    img: "/img/png/sizing-template/male/male_6.png",
  },
  {
    name: "Arm length",
    prop: "armLength",
    img: "/img/png/sizing-template/male/male_7.png",
  },
  {
    name: "Wrist Circumference",
    prop: "wristCircumference",
    img: "/img/png/sizing-template/male/male_8.png",
  },
  {
    name: "Back width",
    prop: "backWidth",
    img: "/img/png/sizing-template/male/male_9.png",
  },
  {
    name: "Hips Circumference",
    prop: "hipsCircumference",
    img: "/img/png/sizing-template/male/male_10.png",
  },
  {
    name: "Body rise/ crotch depth",
    prop: "crotchDepth",
    img: "/img/png/sizing-template/male/male_11.png",
  },
  {
    name: "Neck to waistline",
    prop: "neckToWaistline",
    img: "/img/png/sizing-template/male/male_12.png",
  },
  {
    name: "Waist",
    prop: "waist",
    img: "/img/png/sizing-template/male/male_13.png",
  },
  {
    name: "Inseam",
    prop: "inseam",
    img: "/img/png/sizing-template/male/male_14.png",
  },
  {
    name: "Waist to Knee",
    prop: "waistToKnee",
    img: "/img/png/sizing-template/male/male_15.png",
  },
  {
    name: "Knee circumference",
    prop: "kneeCircumference",
    img: "/img/png/sizing-template/male/male_16.png",
  },
  {
    name: "Ankle circumference",
    prop: "ankleCircumference",
    img: "/img/png/sizing-template/male/male_17.png",
  },
  {
    name: "Nape to waist",
    prop: "napeToWaist",
    img: "/img/png/sizing-template/male/male_18.png",
  },
  {
    name: "Waist to floor",
    prop: "waistToFloor",
    img: "/img/png/sizing-template/male/male_19.png",
  },
  {
    name: "Thigh Circumference",
    prop: "thighCircumference",
    img: "/img/png/sizing-template/male/male_20.png",
  },
  {
    name: "Neck to ankle",
    prop: "neckToAnkle",
    img: "/img/png/sizing-template/male/male_21.png",
  },
  {
    name: "Calf Circumference",
    prop: "calfCircumference",
    img: "/img/png/sizing-template/male/male_22.png",
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
    FEMALE_SIZING_TEMPLATE
  );
