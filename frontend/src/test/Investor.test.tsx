import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Investor from '../pages/Investor';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { act } from 'react';

// Mock des hooks wagmi
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useReadContract: vi.fn(),
  useWriteContract: vi.fn(),
  useWaitForTransactionReceipt: vi.fn(),
}));

vi.mock('../utils/history', () => ({
  getTransactionHistory: vi.fn().mockResolvedValue([]),
}));

describe('Investor Dashboard', () => {
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

  it('renders investor dashboard when connected', async () => {
    await act(async () => {
      render(<Investor />);
    });
    expect(screen.getByText('Investor Dashboard')).toBeInTheDocument();
    expect(screen.getByText('DREIT Balance')).toBeInTheDocument();
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
    render(<Investor />);
    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument();
  });

  it('handles claiming dividends', async () => {
    vi.mocked(useReadContract).mockReturnValueOnce({
      ...mockUseReadContract,
      data: 500000n,
    });
    await act(async () => {
      render(<Investor />);
    });
    const claimButton = screen.getByTestId('claim-button');
    await act(async () => {
      fireEvent.click(claimButton);
    });

    expect(mockWriteContract).toHaveBeenCalled();
  });

  it('handles transferring DREIT', async () => {
    await act(async () => {
      render(<Investor />);
    });
    const transferToInput = screen.getByTestId('transfer-to-input');
    const transferAmountInput = screen.getByTestId('transfer-amount-input');
    const transferButton = screen.getByTestId('transfer-button');

    await act(async () => {
      fireEvent.change(transferToInput, { target: { value: '0x987654321' } });
      fireEvent.change(transferAmountInput, { target: { value: '5' } });
      fireEvent.click(transferButton);
    });

    expect(mockWriteContract).toHaveBeenCalled();
  });

  it('displays transaction history', async () => {
    await act(async () => {
      render(<Investor />);
    });
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
    expect(screen.getByText('No transactions found.')).toBeInTheDocument();
  });
});


