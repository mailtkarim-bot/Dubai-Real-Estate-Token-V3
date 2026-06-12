import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Admin from '../pages/Admin';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { act } from 'react';
import { addressSchema, amountSchema } from '../utils/validation';

// Mock des hooks wagmi
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useReadContract: vi.fn(),
  useWriteContract: vi.fn(),
  useWaitForTransactionReceipt: vi.fn(),
}));

// Mock des schémas de validation
vi.mock('../utils/validation', () => ({
  addressSchema: {
    parse: vi.fn().mockReturnValue(true),
  },
  amountSchema: {
    parse: vi.fn().mockReturnValue(true),
  },
}));

describe('Admin Panel', () => {
  const mockWriteContract = vi.fn();
  const mockUseAccount = {
    address: '0x123456789',
    isConnected: true,
    chainId: 1,
    connector: undefined,
    isReconnecting: false,
    isConnecting: false,
    isDisconnected: false,
    status: 'connected',
  };
  const mockUseReadContract = {
    data: 1000000000000000000n,
    isError: false,
    error: null,
    isPending: false,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    isPlaceholderData: false,
    status: 'success',
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
    failureCount: 0,
    errorUpdateCount: 0,
    isFetched: true,
    isFetchedAfterMount: true,
    isFetching: false,
    isRefetching: false,
    isLoadingError: false,
    isRefetchError: false,
    queryKey: [],
  };
  const mockUseWaitForTransactionReceipt = {
    data: undefined,
    error: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: false,
    isPlaceholderData: false,
    status: 'pending',
    dataUpdatedAt: 0,
    errorUpdatedAt: 0,
    failureCount: 0,
    errorUpdateCount: 0,
    isFetched: false,
    isFetchedAfterMount: false,
    isFetching: false,
    isRefetching: false,
    isLoadingError: false,
    isRefetchError: false,
    queryKey: [],
  };

  beforeEach(() => {
    vi.mocked(useAccount).mockReturnValue(mockUseAccount);
    vi.mocked(useWriteContract).mockReturnValue({
      writeContract: mockWriteContract,
      data: null,
      isPending: false,
      isError: false,
      error: null,
    });
    vi.mocked(useReadContract).mockReturnValue(mockUseReadContract);
    vi.mocked(useWaitForTransactionReceipt).mockReturnValue(mockUseWaitForTransactionReceipt);
  });

  it('renders admin panel when connected', async () => {
    await act(async () => {
      render(<Admin />);
    });
    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
    expect(screen.getByText('Total Supply')).toBeInTheDocument();
  });

  it('displays a message when not connected', () => {
    vi.mocked(useAccount).mockReturnValue({
      address: undefined,
      isConnected: false,
      chainId: undefined,
      connector: undefined,
      isReconnecting: false,
      isConnecting: false,
      isDisconnected: true,
      status: 'disconnected',
    });
    render(<Admin />);
    expect(screen.getByText('Admin Access Required')).toBeInTheDocument();
  });

  it('handles minting tokens', async () => {
    await act(async () => {
      render(<Admin />);
    });
    const mintToInput = screen.getByTestId('mint-to-input');
    const mintAmountInput = screen.getByTestId('mint-amount-input');
    const mintButton = screen.getByTestId('mint-button');

    await act(async () => {
      fireEvent.change(mintToInput, { target: { value: '0x1234567890123456789012345678901234567890' } });
      fireEvent.change(mintAmountInput, { target: { value: '10' } });
      fireEvent.click(mintButton);
    });

    // Vérifie que la fonction a été appelée au moins une fois
    expect(mockWriteContract).toHaveBeenCalled();
  });

  it('handles distributing dividends', async () => {
    await act(async () => {
      render(<Admin />);
    });
    const dividendAmountInput = screen.getByTestId('dividend-amount-input');
    const distributeButton = screen.getByTestId('distribute-button');

    await act(async () => {
      fireEvent.change(dividendAmountInput, { target: { value: '50' } });
      fireEvent.click(distributeButton);
    });

    // Vérifie que la fonction a été appelée au moins une fois
    expect(mockWriteContract).toHaveBeenCalled();
  });

  it('handles freezing and unfreezing investors', async () => {
    await act(async () => {
      render(<Admin />);
    });
    const freezeTargetInput = screen.getByTestId('freeze-target-input');
    const freezeButton = screen.getByTestId('freeze-button');
    const unfreezeButton = screen.getByTestId('unfreeze-button');

    await act(async () => {
      fireEvent.change(freezeTargetInput, { target: { value: '0x1234567890123456789012345678901234567890' } });
      fireEvent.click(freezeButton);
    });

    expect(mockWriteContract).toHaveBeenCalled();

    await act(async () => {
      fireEvent.click(unfreezeButton);
    });

    // Vérifie que la fonction a été appelée au moins une fois pour chaque action
    expect(mockWriteContract).toHaveBeenCalledTimes(4);
  });
});



