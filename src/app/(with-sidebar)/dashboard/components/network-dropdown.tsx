'use client';

import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWalletBalances } from '@/hooks/web3/use-wallet-balances';

export type NetworkValue = 'base' | 'stellar';

const networkMeta: Record<
  NetworkValue,
  { label: string; logoSrc: string; logoAlt: string }
> = {
  base: { label: 'Base', logoSrc: '/svg/base_logo.svg', logoAlt: 'Base' },
  stellar: {
    label: 'Stellar',
    logoSrc: '/svg/stellar_logo.svg',
    logoAlt: 'Stellar',
  },
};

const formatRowBalance = (v?: string) => {
  const n = Number(v ?? 0);
  if (!Number.isFinite(n)) return '0';
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const formatTotalBalance = (base?: string, stellar?: string) => {
  const b = Number(base ?? 0);
  const s = Number(stellar ?? 0);
  const total = (Number.isFinite(b) ? b : 0) + (Number.isFinite(s) ? s : 0);
  return total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const NetworkDropdown = ({
  value,
  disabled,
  onChange,
}: {
  value: NetworkValue;
  disabled?: boolean;
  onChange: (v: NetworkValue) => void;
}) => {
  const meta = networkMeta[value];
  const [open, setOpen] = useState(false);
  const { baseUsdc, stellarUsdc } = useWalletBalances();

  const total = useMemo(() => formatTotalBalance(baseUsdc, stellarUsdc), [baseUsdc, stellarUsdc]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button
          variant='outline'
          size='sm'
          className='h-9 gap-2 px-3'
          aria-label='Select network'
        >
          <Image src={meta.logoSrc} alt={meta.logoAlt} width={16} height={16} />
          <span>{meta.label}</span>
          {open ? (
            <ChevronUp className='ml-1 size-4 text-muted-foreground' />
          ) : (
            <ChevronDown className='ml-1 size-4 text-muted-foreground' />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='min-w-[260px] p-0'>
        <div className='grid grid-cols-2 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground'>
          <span>Accounts</span>
          <span className='text-right'>Balance in USDC</span>
        </div>
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(v) => onChange(v as NetworkValue)}
        >
          {(Object.keys(networkMeta) as NetworkValue[]).map((k) => {
            const item = networkMeta[k];
            const bal = k === 'base' ? baseUsdc : stellarUsdc;
            return (
              <DropdownMenuRadioItem key={k} value={k} className='px-3 py-2'>
                <div className='grid w-full grid-cols-2 items-center gap-2'>
                  <div className='flex items-center gap-2'>
                    <Image
                      src={item.logoSrc}
                      alt={item.logoAlt}
                      width={16}
                      height={16}
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className='text-right tabular-nums'>
                    {formatRowBalance(bal)}
                  </span>
                </div>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
        <div className='grid grid-cols-2 gap-2 border-t px-3 py-2 text-sm'>
          <span className='font-medium text-muted-foreground'>Total Balance</span>
          <span className='text-right font-medium tabular-nums'>{total}</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

