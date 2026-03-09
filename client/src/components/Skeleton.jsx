import React from 'react';

export const SkeletonLine = ({ width = '100%', height = '16px', style }) => (
    <div className="skeleton-line" style={{ width, height, ...style }} />
);

export const SkeletonStat = () => (
    <div className="stat-card skeleton-stat">
        <SkeletonLine width="60%" height="12px" style={{ marginBottom: '12px' }} />
        <SkeletonLine width="80%" height="32px" />
    </div>
);

export const SkeletonCard = () => (
    <div className="customer-card skeleton-card-item">
        <div className="customer-card-header">
            <div className="skeleton-avatar" />
            <div style={{ flex: 1 }}>
                <SkeletonLine width="65%" height="16px" style={{ marginBottom: '8px' }} />
                <SkeletonLine width="40%" height="12px" />
            </div>
        </div>
        <div className="customer-balance" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
            <SkeletonLine width="30%" height="12px" />
            <SkeletonLine width="25%" height="20px" />
        </div>
    </div>
);

export const SkeletonRow = ({ columns = 4 }) => (
    <tr className="skeleton-row">
        {Array.from({ length: columns }).map((_, i) => (
            <td key={i}>
                <SkeletonLine width={i === 0 ? '70%' : i === columns - 1 ? '50%' : '60%'} height="14px" />
            </td>
        ))}
    </tr>
);

export const SkeletonProfile = () => (
    <div className="card-glass skeleton-profile" style={{ marginBottom: 'var(--space-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
            <div className="skeleton-avatar" style={{ width: 72, height: 72 }} />
            <div style={{ flex: 1 }}>
                <SkeletonLine width="40%" height="24px" style={{ marginBottom: '8px' }} />
                <SkeletonLine width="60%" height="14px" />
            </div>
            <div style={{ textAlign: 'right' }}>
                <SkeletonLine width="80px" height="12px" style={{ marginBottom: '8px', marginLeft: 'auto' }} />
                <SkeletonLine width="100px" height="28px" style={{ marginLeft: 'auto' }} />
            </div>
        </div>
    </div>
);

export const DashboardSkeleton = () => (
    <div className="animate-in">
        <div className="page-header flex-between">
            <div>
                <SkeletonLine width="180px" height="32px" style={{ marginBottom: '8px' }} />
                <SkeletonLine width="220px" height="14px" />
            </div>
            <SkeletonLine width="140px" height="44px" style={{ borderRadius: 'var(--radius-md)' }} />
        </div>
        <div className="stats-grid">
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
        </div>
        <SkeletonLine width="180px" height="20px" style={{ marginBottom: 'var(--space-md)' }} />
        <div className="customer-grid">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    </div>
);

export const ReportsSkeleton = () => (
    <div className="animate-in">
        <div className="page-header">
            <SkeletonLine width="140px" height="32px" style={{ marginBottom: '8px' }} />
            <SkeletonLine width="240px" height="14px" />
        </div>
        <div className="stats-grid">
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
            <SkeletonStat />
        </div>
        <SkeletonLine width="160px" height="20px" style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }} />
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th><SkeletonLine width="20px" height="10px" /></th>
                        <th><SkeletonLine width="80px" height="10px" /></th>
                        <th><SkeletonLine width="60px" height="10px" /></th>
                        <th><SkeletonLine width="70px" height="10px" /></th>
                    </tr>
                </thead>
                <tbody>
                    <SkeletonRow columns={4} />
                    <SkeletonRow columns={4} />
                    <SkeletonRow columns={4} />
                </tbody>
            </table>
        </div>
    </div>
);
