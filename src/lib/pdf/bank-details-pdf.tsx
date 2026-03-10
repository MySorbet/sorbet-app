'use client';

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  pdf,
} from '@react-pdf/renderer';
import { createElement } from 'react';

import type { BankExportData, DueBankExportAccount } from '@/api/bridge/bridge';
import type {
  DueVirtualAccountAEDDetails,
  DueVirtualAccountEURDetails,
  DueVirtualAccountGBPDetails,
  DueVirtualAccountSWIFTDetails,
  DueVirtualAccountUSDetails,
} from '@/types/due';


const COLORS = {
  black: '#0A0A0A',
  muted: '#6B7280',
  border: '#E5E7EB',
  cardBg: '#F9FAFB',
  mono: '#1F2937',
  accent: '#111827',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 48,
    paddingVertical: 44,
    color: COLORS.black,
    fontSize: 10,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  headerWordmark: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 15,
    letterSpacing: 0.4,
    color: COLORS.black,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 13,
    color: COLORS.black,
    marginBottom: 3,
  },
  headerDate: {
    fontSize: 9,
    color: COLORS.muted,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 20,
  },

  // Section
  sectionLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    letterSpacing: 1.2,
    color: COLORS.muted,
    textTransform: 'uppercase',
    marginBottom: 14,
  },

  // Account card
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardCurrencyBadge: {
    fontFamily: 'Helvetica-Bold',
    backgroundColor: COLORS.accent,
    color: '#FFFFFF',
    fontSize: 7,
    letterSpacing: 0.8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    marginRight: 8,
  },
  cardTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: COLORS.black,
  },

  // Row inside a card
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rowLabel: {
    fontSize: 9,
    color: COLORS.muted,
    width: 130,
  },
  rowValue: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    color: COLORS.mono,
    flex: 1,
    textAlign: 'right',
  },
  rowValueMono: {
    fontFamily: 'Courier-Bold',
    fontSize: 9,
    color: COLORS.mono,
    flex: 1,
    textAlign: 'right',
  },

  // Empty state (no italic — Inter italic not registered, would cause font resolve error)
  emptyText: {
    fontSize: 9,
    color: COLORS.muted,
  },

  // Footer
  footer: {
    marginTop: 28,
    paddingTop: 16,
    borderTop: `1px solid ${COLORS.border}`,
  },
  footerWarning: {
    fontSize: 8,
    color: COLORS.muted,
    marginBottom: 6,
    lineHeight: 1.5,
  },
  footerGenerated: {
    fontSize: 8,
    color: COLORS.muted,
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatIBAN(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}


// Sub-components


function Divider() {
  return createElement(View, { style: styles.divider });
}

function SectionLabel({ children }: { children: string }) {
  return createElement(Text, { style: styles.sectionLabel }, children);
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return createElement(
    View,
    { style: styles.row },
    createElement(Text, { style: styles.rowLabel }, label),
    createElement(
      Text,
      { style: mono ? styles.rowValueMono : styles.rowValue },
      value
    )
  );
}

function CardHeader({
  currency,
  title,
}: {
  currency: string;
  title: string;
}) {
  return createElement(
    View,
    { style: styles.cardHeader },
    createElement(Text, { style: styles.cardCurrencyBadge }, currency),
    createElement(Text, { style: styles.cardTitle }, title)
  );
}


// Account card renderers


function renderDueAccount(va: DueBankExportAccount) {
  const d = va.details as Record<string, unknown>;

  switch (va.schema) {
    case 'bank_us': {
      const det = d as unknown as DueVirtualAccountUSDetails;
      const beneficiary =
        det.accountName ||
        [det.firstName, det.lastName].filter(Boolean).join(' ') ||
        det.companyName ||
        '';
      return createElement(
        View,
        { style: styles.card, key: va.schema },
        createElement(CardHeader as React.ComponentType<{ currency: string; title: string }>, { currency: 'USD', title: 'ACH & Wire' }),
        det.accountNumber && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Account Number', value: det.accountNumber, mono: true }),
        (det.routingNumberACH || det.routingNumber) &&
          createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, {
            label: 'Routing (ACH)',
            value: det.routingNumberACH || det.routingNumber,
            mono: true,
          }),
        det.routingNumberWire &&
          det.routingNumberWire !== det.routingNumberACH &&
          createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Routing (Wire)', value: det.routingNumberWire, mono: true }),
        det.bankName && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Bank', value: det.bankName }),
        beneficiary && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Beneficiary', value: beneficiary })
      );
    }

    case 'bank_sepa': {
      const det = d as unknown as DueVirtualAccountEURDetails;
      const beneficiary =
        [det.firstName, det.lastName].filter(Boolean).join(' ') ||
        det.companyName ||
        '';
      return createElement(
        View,
        { style: styles.card, key: va.schema },
        createElement(CardHeader as React.ComponentType<{ currency: string; title: string }>, { currency: 'EUR', title: 'SEPA' }),
        det.IBAN && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'IBAN', value: formatIBAN(det.IBAN), mono: true }),
        det.swiftCode && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'BIC / SWIFT', value: det.swiftCode, mono: true }),
        det.bankName && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Bank', value: det.bankName }),
        beneficiary && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Beneficiary', value: beneficiary })
      );
    }

    case 'bank_mena': {
      const det = d as unknown as DueVirtualAccountAEDDetails;
      const beneficiary =
        [det.firstName, det.lastName].filter(Boolean).join(' ') ||
        det.companyName ||
        '';
      return createElement(
        View,
        { style: styles.card, key: va.schema },
        createElement(CardHeader as React.ComponentType<{ currency: string; title: string }>, { currency: 'AED', title: 'Local Transfer' }),
        det.IBAN && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'IBAN', value: formatIBAN(det.IBAN), mono: true }),
        det.swiftCode && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'BIC / SWIFT', value: det.swiftCode, mono: true }),
        det.bankName && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Bank', value: det.bankName }),
        beneficiary && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Beneficiary', value: beneficiary })
      );
    }

    case 'bank_uk': {
      const det = d as unknown as DueVirtualAccountGBPDetails;
      const beneficiary =
        [det.firstName, det.lastName].filter(Boolean).join(' ') ||
        det.companyName ||
        '';
      return createElement(
        View,
        { style: styles.card, key: va.schema },
        createElement(CardHeader as React.ComponentType<{ currency: string; title: string }>, { currency: 'GBP', title: 'Faster Payments' }),
        det.accountNumber && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Account Number', value: det.accountNumber, mono: true }),
        det.sortCode && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Sort Code', value: det.sortCode, mono: true }),
        det.bankName && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Bank', value: det.bankName }),
        beneficiary && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Beneficiary', value: beneficiary })
      );
    }

    case 'bank_swift_usd':
    case 'bank_swift': {
      const det = d as unknown as DueVirtualAccountSWIFTDetails;
      const beneficiary =
        [det.firstName, det.lastName].filter(Boolean).join(' ') ||
        det.companyName ||
        '';
      return createElement(
        View,
        { style: styles.card, key: va.schema },
        createElement(CardHeader as React.ComponentType<{ currency: string; title: string }>, { currency: det.currency?.toUpperCase() || 'USD', title: 'SWIFT' }),
        det.swiftAccountNumber && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Account Number', value: det.swiftAccountNumber, mono: true }),
        det.swiftCode && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'BIC / SWIFT', value: det.swiftCode, mono: true }),
        det.bankName && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Bank', value: det.bankName }),
        beneficiary && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Beneficiary', value: beneficiary })
      );
    }

    default:
      return null;
  }
}

function renderBridgeAccount(
  account: BankExportData['bridge']['accounts'][number]
) {
  if (account.type === 'USD') {
    const d = account.details;
    return createElement(
      View,
      { style: styles.card, key: 'bridge-usd' },
      createElement(CardHeader as React.ComponentType<{ currency: string; title: string }>, { currency: 'USD', title: 'ACH & Wire' }),
      d.bank_account_number && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Account Number', value: String(d.bank_account_number), mono: true }),
      d.bank_routing_number && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Routing Number', value: String(d.bank_routing_number), mono: true }),
      d.bank_name && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Bank', value: String(d.bank_name) }),
      d.bank_beneficiary_name && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Beneficiary', value: String(d.bank_beneficiary_name) })
    );
  }

  if (account.type === 'EUR') {
    const d = account.details;
    return createElement(
      View,
      { style: styles.card, key: 'bridge-eur' },
      createElement(CardHeader as React.ComponentType<{ currency: string; title: string }>, { currency: 'EUR', title: 'SEPA' }),
      d.iban && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'IBAN', value: formatIBAN(String(d.iban)), mono: true }),
      d.bic && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'BIC / SWIFT', value: String(d.bic), mono: true }),
      d.bank_name && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Bank', value: String(d.bank_name) }),
      d.account_holder_name && createElement(InfoRow as React.ComponentType<{ label: string; value: string; mono?: boolean }>, { label: 'Account Holder', value: String(d.account_holder_name) })
    );
  }

  return null;
}


// PDF Document


function BankDetailsPdfDocument({
  data,
  generatedAt,
}: {
  data: BankExportData;
  generatedAt: Date;
}) {
  const { bridge, due } = data;

  // Decide active vs inactive
  const activeAccounts: React.ReactNode[] = [];
  const inactiveAccounts: React.ReactNode[] = [];

  if (due.kycApproved) {
    // Due accounts are active; bridge accounts (if any) are inactive legacy accounts
    due.accounts.forEach((va) => {
      const node = renderDueAccount(va);
      if (node) activeAccounts.push(node);
    });
    if (bridge.kycApproved) {
      bridge.accounts.forEach((acc) => {
        const node = renderBridgeAccount(acc);
        if (node) inactiveAccounts.push(node);
      });
    }
  } else if (bridge.kycApproved) {
    // Only Bridge — all Bridge accounts are active
    bridge.accounts.forEach((acc) => {
      const node = renderBridgeAccount(acc);
      if (node) activeAccounts.push(node);
    });
  }

  const dateStr = formatDate(generatedAt);

  return createElement(
    Document,
    { title: 'Bank Account Details — Sorbet' },
    createElement(
      Page,
      { size: 'A4', style: styles.page },

      // Header
      createElement(
        View,
        { style: styles.header },
        createElement(Text, { style: styles.headerWordmark }, 'sorbet'),
        createElement(
          View,
          { style: styles.headerRight },
          createElement(Text, { style: styles.headerTitle }, 'Bank Account Details'),
          createElement(Text, { style: styles.headerDate }, dateStr)
        )
      ),

      createElement(Divider as React.ComponentType<Record<string, never>>, {}),

      // Active Accounts
      createElement(SectionLabel as React.ComponentType<{ children: string }>, {}, 'Active Bank Accounts'),
      activeAccounts.length > 0
        ? createElement(View, {}, ...activeAccounts)
        : createElement(Text, { style: styles.emptyText }, 'No active bank accounts'),

      createElement(Divider as React.ComponentType<Record<string, never>>, {}),

      // Inactive Accounts
      createElement(SectionLabel as React.ComponentType<{ children: string }>, {}, 'Inactive Bank Accounts'),
      inactiveAccounts.length > 0
        ? createElement(View, {}, ...inactiveAccounts)
        : createElement(Text, { style: styles.emptyText }, 'No inactive bank accounts'),

      // Footer
      createElement(
        View,
        { style: styles.footer },
        createElement(
          Text,
          { style: styles.footerWarning },
          'Important: Only send funds to your Active bank accounts.'
        ),
        createElement(
          Text,
          { style: styles.footerGenerated },
          `Generated ${dateStr} · Sorbet`
        )
      )
    )
  );
}


// Export function


/**
 * Generate and trigger download of a Bank Details PDF for the current user.
 */
export async function downloadBankDetailsPdf(data: BankExportData) {
  const generatedAt = new Date();

  const doc = createElement(BankDetailsPdfDocument, { data, generatedAt });
  const blob = await pdf(doc as Parameters<typeof pdf>[0]).toBlob();

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sorbet-bank-details-${generatedAt.toISOString().split('T')[0]}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
