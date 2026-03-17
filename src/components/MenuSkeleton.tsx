import React from 'react';

const SkeletonItem: React.FC = () => (
    <div className="flex justify-between items-center py-4 border-b border-white/5 animate-pulse">
        <div className="space-y-2 flex-1">
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
            <div className="h-3 bg-white/5 rounded w-1/2"></div>
        </div>
        <div className="h-4 bg-white/10 rounded w-20 ml-4"></div>
    </div>
);

const MenuSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-zinc-950 p-4 space-y-12">
            {/* Header Skeleton */}
            <div className="flex flex-col items-center space-y-6 pt-8">
                <div className="w-32 h-32 bg-white/5 rounded-3xl"></div>
                <div className="h-4 bg-white/5 rounded w-48"></div>
            </div>

            {/* Categories Skeleton */}
            <div className="flex gap-3 overflow-hidden">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-10 bg-white/5 rounded-full w-24 flex-shrink-0"></div>
                ))}
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(col => (
                    <div key={col} className="space-y-8">
                        <div className="h-8 bg-white/10 rounded w-1/2 mx-auto"></div>
                        <div className="space-y-1">
                            {[1, 2, 3, 4, 5].map(i => (
                                <SkeletonItem key={i} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MenuSkeleton;
