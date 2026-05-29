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
import { formatCurrencyValue } from "@/lib/number";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    color: "#000",
    fontSize: 11,
    padding: 24,
    position: "relative",
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
    borderSpacing: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 12,
  },
  colDescription: {
    width: 130,
    flexShrink: 0,
  },
  colDate: {
    width: 72,
    flexShrink: 0,
  },
  colPrice: {
    width: 72,
    flexShrink: 0,
    marginLeft: 24,
  },
  colCommission: {
    width: 88,
    flexShrink: 0,
    textAlign: "center",
  },
  colEarnings: {
    flexGrow: 1,
    flexShrink: 0,
    textAlign: "right",
    transform: "translateX(36px)",
  },
  rowClient: {
    justifyContent: "space-between",
  },
  clientCol: {
    flexGrow: 1,
    flexBasis: 0,
    flexShrink: 1,
  },
  tableHeaderRow: {
    marginBottom: 8,
  },
  tableRow: {
    backgroundColor: "#f3f4f7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "flex-start",
  },
  tableBody: {
    gap: 8,
    flexDirection: "column",
    marginBottom: 40,
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)  rotate(45deg)",
    fontSize: 50,
    textTransform: "uppercase",
    opacity: 0.2,
  },
});

type InvoiceProps = {
  project?: UmojaLinnProject;
  milestones?: UmojaLinnMilestone[];
  isDesigner?: boolean;
};

// Create Document Component
const Invoice = (props: InvoiceProps) => {
  const totalFromMilestones =
    props?.milestones?.reduce(
      (amount, milestone) => amount + (milestone?.amount || 0),
      0,
    ) || 0;

  // Footer "TOTAL PRICE" uses approvedBudget; commission/earnings must use the same
  // gross total or they inflate when milestone.amount sums disagree (e.g. API scale).
  const grossTotal =
    props.isDesigner && props.project?.approvedBudget != null
      ? props.project.approvedBudget
      : totalFromMilestones;

  const totalCommission = grossTotal * 0.17;
  const baseSubTotal = grossTotal - totalCommission;

  const deliveryMilestone = props?.milestones?.[props?.milestones?.length - 1];
  const currency =
    // "N"
    getCurrencySymbol(props.project?.currency) === "₦"
      ? "N"
      : getCurrencySymbol(props.project?.currency);

  return (
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
              <Text>Generated via Umoja linn</Text>
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
                {deliveryMilestone?.lastMilestoneApprovedAt
                  ? formatDate(
                      deliveryMilestone?.lastMilestoneApprovedAt,
                      "dd.MM.yyy",
                    )
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.dateWrapper}>
              <Text style={styles.fontBold}>Start date:</Text>
              <Text style={styles.bodyText}>
                {props.project?.bidAcceptedDate &&
                  formatDate(props.project?.bidAcceptedDate, "dd.MM.yyy")}
              </Text>
            </View>
            <View style={styles.dateWrapper}>
              <Text style={styles.fontBold}>Due date:</Text>
              <Text style={styles.bodyText}>
                {props.project?.dueDate &&
                  formatDate(props.project?.dueDate, "dd.MM.yyy")}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.bodyWrapper}>
          <View
            style={[
              styles.fontBold,
              styles.row,
              styles.tableHeaderRow,
              ...(!props.isDesigner ? [styles.rowClient] : []),
            ]}
          >
            <Text
              style={
                props.isDesigner ? styles.colDescription : styles.clientCol
              }
            >
              Milestone description
            </Text>
            <Text style={props.isDesigner ? styles.colDate : styles.clientCol}>
              Date
            </Text>
            {props.isDesigner ? (
              <>
                <Text style={styles.colPrice}>Price</Text>
                <Text style={styles.colCommission}>Commission</Text>
                <Text style={styles.colEarnings}>Earnings</Text>
              </>
            ) : (
              <Text style={styles.clientCol}>Total</Text>
            )}
          </View>
          <View style={styles.tableBody}>
            {props?.milestones?.map((milestone, index) => {
              const total = milestone?.amount || 0;
              const commission = total * 0.17;
              const price = total - commission;

              return (
                <View
                  key={milestone?.id}
                  style={[
                    styles.tableRow,
                    styles.row,
                    ...(!props.isDesigner ? [styles.rowClient] : []),
                  ]}
                >
                  <View
                    style={
                      props.isDesigner
                        ? styles.colDescription
                        : styles.clientCol
                    }
                  >
                    <Text style={styles.fontBold}>
                      {milestone?.deliveryMethod
                        ? "Delivery milestone"
                        : `Milestone ${index + 1}`}
                    </Text>
                    <Text style={styles.bodyText}>{milestone?.title}</Text>
                  </View>
                  <Text
                    style={props.isDesigner ? styles.colDate : styles.clientCol}
                  >
                    {milestone?.paidOutDate
                      ? formatDate(milestone?.paidOutDate, "dd/MM/YYY")
                      : "-"}
                  </Text>
                  {props.isDesigner ? (
                    <>
                      <Text style={styles.colPrice}>
                        {currency}
                        {formatCurrencyValue(total)}
                      </Text>
                      <Text style={styles.colCommission}>
                        ( {currency}
                        {formatCurrencyValue(commission)})
                      </Text>
                      <Text style={[styles.colEarnings, styles.successText]}>
                        {currency}
                        {formatCurrencyValue(price)}
                      </Text>
                    </>
                  ) : (
                    <Text style={[styles.clientCol, styles.successText]}>
                      {currency}
                      {formatCurrencyValue(total)}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
          <View
            style={[
              styles.bodyText,
              { alignSelf: "flex-end", maxWidth: 300, gap: 12 },
            ]}
          >
            {props.isDesigner && (
              <>
                <View style={styles.dateWrapper}>
                  <Text>TOTAL PRICE</Text>
                  <Text>
                    {currency}
                    {formatCurrencyValue(props?.project?.approvedBudget)}
                  </Text>
                </View>

                <View style={styles.dateWrapper}>
                  <Text>COMMISSION (17%)</Text>
                  <Text>
                    ( {currency}
                    {formatCurrencyValue(totalCommission)})
                  </Text>
                </View>
              </>
            )}
            <View
              style={[
                styles.alignRight,
                {
                  marginTop: 20,
                },
              ]}
            >
              <Text style={[styles.fontBold, { marginBottom: 2 }]}>
                {props.isDesigner ? "TOTAL EARNINGS" : "TOTAL AMOUNT"}
              </Text>
              <Text style={[styles.headerTitle, styles.primaryText]}>
                {currency}
                {props.isDesigner
                  ? formatCurrencyValue(baseSubTotal)
                  : formatCurrencyValue(props?.project?.approvedBudget)}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.alignCenter, styles.bodyText, { gap: 2 }]}>
          <Text style={[styles.fontBold]}>
            Thank you for your support. Your PERFECT FIT is our priority.
          </Text>
          <Text>For inquiries contact support@umojalinn.com</Text>
        </View>
      </Page>
    </Document>
  );
};

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
