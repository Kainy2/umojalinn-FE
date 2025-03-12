import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image as PDFImage,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { UmojaLinnMilestone, UmojaLinnProject } from "@/types/project";
import { uuidToBase62Safe } from "@/lib/uuid";
import { formatDate } from "date-fns";
import { getCurrencySymbol } from "@/lib/string";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: 11,
    padding: 24,
  },
  logo: {
    height: 70,
    width: 70,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
  },
  imageTitleWrapper: {
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitleWrapper: {
    flexDirection: "column",
  },
  preHeaderTitle: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 28,
    marginBottom: 2,
  },
  fontBold: {
    fontWeight: 700,
  },
  bodyText: {
    color: "#667085",
  },
  primaryText: {
    color: "hsl(43 93% 47%)",
    textTransform: "uppercase",
  },
  successText: {
    color: "#12B76A",
  },
  addressWrapper: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "space-between",
    marginBottom: 50,
  },
  addressItem: {
    flexDirection: "column",
    gap: 4,
    maxWidth: 200,
  },
  alignRight: {
    textAlign: "right",
    alignItems: "flex-end",
  },
  alignCenter: {
    textAlign: "center",
    alignItems: "center",
  },
  dateWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  bodyWrapper: {
    flexGrow: 1,
  },
  row: {
    flexDirection: "row",
  },
  column: { flexGrow: 1 },
  column1Header: {
    width: 90 + 12,
  },
  column1: {
    width: 90,
  },
  column2: {
    width: 60,
  },
  column3: {
    width: 60,
  },
  column4: {
    width: 60,
  },
  column5: {
    textAlign: "right",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  tableRow: {
    backgroundColor: "#f3f4f7",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  tableBody: {
    gap: 8,
    flexDirection: "column",
    marginBottom: 40,
  },
});

type InvoiceProps = {
  project?: UmojaLinnProject;
  milestones?: UmojaLinnMilestone[];
};

// Create Document Component
const Invoice = (props: InvoiceProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.imageTitleWrapper}>
          <PDFImage src="/img/png/umoja.png" style={styles.logo} />
          <View style={styles.headerTitleWrapper}>
            <Text style={[styles.preHeaderTitle]}>Invoice for</Text>
            <Text style={[styles.headerTitle, styles.fontBold]}>
              {props.project?.title}
            </Text>
            <Text>Generated via Umojalinn</Text>
          </View>
        </View>
        <View style={styles.alignRight}>
          <Text>#{uuidToBase62Safe(props.project?.id || "")}</Text>
          <Text style={styles.bodyText}>Receipt ID</Text>
        </View>
      </View>
      <View style={styles.addressWrapper}>
        <View style={styles.addressItem}>
          <Text style={[styles.primaryText]}>Client</Text>
          <Text style={styles.fontBold}>
            {props.project?.buyer?.user?.firstName}{" "}
            {props.project?.buyer?.user?.lastName}
          </Text>
          <Text>{props.project?.buyer?.user?.address?.address}</Text>
          <Text>
            {[
              props.project?.buyer?.user?.address?.city,
              props.project?.buyer?.user?.address?.country,
              props.project?.buyer?.user?.address?.state,
            ]
              .filter((address) => address)
              .join(" ,")}
          </Text>
        </View>
        <View style={styles.addressItem}>
          <Text style={[styles.primaryText]}>Designer</Text>
          <Text style={styles.fontBold}>
            {props.project?.designer?.user?.firstName}{" "}
            {props.project?.designer?.user?.lastName}
          </Text>
          <Text>{props.project?.buyer?.user?.address?.address}</Text>
          <Text>
            {[
              props.project?.designer?.user?.address?.city,
              props.project?.designer?.user?.address?.country,
              props.project?.designer?.user?.address?.state,
            ]
              .filter((address) => address)
              .join(" ,")}
          </Text>
        </View>
        <View style={styles.addressItem}>
          <Text style={[styles.primaryText]}> </Text>
          <View style={styles.dateWrapper}>
            <Text style={styles.fontBold}>Completion date:</Text>
            <Text style={styles.bodyText}>
              {props.project?.dueDate &&
                formatDate(props.project?.dueDate, "dd.MM.YYY")}
            </Text>
          </View>
          <View style={styles.dateWrapper}>
            <Text style={styles.fontBold}>Start date:</Text>
            <Text style={styles.bodyText}>
              {props.project?.bidAcceptedDate &&
                formatDate(props.project?.bidAcceptedDate, "dd.MM.YYY")}
            </Text>
          </View>
          <View style={styles.dateWrapper}>
            <Text style={styles.fontBold}>Due date:</Text>
            <Text style={styles.bodyText}>
              {props.project?.dueDate &&
                formatDate(props.project?.dueDate, "dd.MM.YYY")}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.bodyWrapper}>
        <View
          style={[
            styles.fontBold,
            styles.row,
            {
              marginBottom: 8,
            },
          ]}
        >
          <Text style={[styles.column, styles.column1Header]}>
            Milestone description
          </Text>
          <Text style={[styles.column, styles.column2]}>Date</Text>
          <Text style={[styles.column, styles.column3]}>Price</Text>
          <Text style={[styles.column, styles.column4]}>Service charge</Text>
          <Text style={[styles.column, styles.column5, styles.alignRight]}>
            TOTAL
          </Text>
        </View>
        <View style={styles.tableBody}>
          {props?.milestones?.map((milestone, index) => (
            <View key={milestone?.id} style={[styles.tableRow, styles.row]}>
              <View style={[styles.column, styles.column1]}>
                <Text style={styles.fontBold}>
                  {milestone?.deliveryMethod
                    ? "Delivery milestone"
                    : `Milestone ${index + 1}`}
                </Text>
                <Text style={styles.bodyText}>{milestone?.title}</Text>
              </View>
              <Text style={[styles.column, styles.column2]}>
                {milestone?.updatedAt &&
                  formatDate(milestone?.updatedAt, "dd/MM/YYY")}
              </Text>
              <Text style={[styles.column, styles.column3]}>
                {getCurrencySymbol(props?.project?.currency)}
                {milestone?.amount}
              </Text>
              <Text style={[styles.column, styles.column4, styles.successText]}>
                {getCurrencySymbol(props?.project?.currency)}
                {0}
              </Text>
              <Text style={[styles.column, styles.column5]}>
                {getCurrencySymbol(props?.project?.currency)}
                {(milestone?.amount || 0) + 0}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={[
            styles.bodyText,
            { alignSelf: "flex-end", maxWidth: 300, gap: 12 },
          ]}
        >
          <View style={styles.dateWrapper}>
            <Text>SERVICE CHARGE (0%)</Text>
            <Text>
              {getCurrencySymbol(props.project?.currency)}
              {0}
            </Text>
          </View>
          <View style={styles.dateWrapper}>
            <Text>SUB TOTAL</Text>
            <Text>
              {getCurrencySymbol(props.project?.currency)}
              {props?.milestones?.reduce(
                (amount, milestone) => amount + (milestone?.amount || 0),
                0,
              )}
            </Text>
          </View>
          <View
            style={[
              styles.alignRight,
              {
                marginTop: 20,
              },
            ]}
          >
            <Text style={[styles.fontBold, { marginBottom: 2 }]}>
              TOTAL AMOUNT
            </Text>
            <Text style={[styles.headerTitle, styles.primaryText]}>
              {getCurrencySymbol(props.project?.currency)}
              {props?.project?.approvedBudget}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.alignCenter, styles.bodyText, { gap: 2 }]}>
        <Text style={[styles.fontBold]}>
          Thank you for supporting Umojalinn. We trust you got your PERFECT FIT
        </Text>
        <Text>For inquiries contact support@umojalinn.com</Text>
      </View>
    </Page>
  </Document>
);

export const InvoiceButton = (
  props: { className?: string; noFullWidth?: boolean } & InvoiceProps,
) => {
  if (!props.project || !props.milestones)
    return <Skeleton className="h-12 w-full rounded-sm" />;
  return (
    <PDFDownloadLink
      document={<Invoice {...props} />}
      fileName={`${props?.project?.title}.pdf`}
    >
      {({ loading }) =>
        loading ? (
          <Skeleton
            className={cn(
              "h-12 rounded-sm",
              !props.noFullWidth && " w-full",
              props.className,
            )}
          />
        ) : (
          <Button
            className={props.className}
            fullWidth={!props.noFullWidth}
            variant="outline"
          >
            Invoice
          </Button>
        )
      }
    </PDFDownloadLink>
  );
};

export default Invoice;
