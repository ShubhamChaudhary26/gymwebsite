// app/profile/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    User,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle,
    CreditCard,
    RefreshCw,
    XCircle,
    Loader2,
    Mail,
    UserCircle,
    Shield,
    History,
    Trophy,
    Zap,
    TrendingUp,
    Star,
    Settings,
    Lock,
    KeyRound,
    Eye,
    EyeOff
} from "lucide-react";
import Link from "next/link";

// Types
interface UserData {
    _id: string;
    username: string;
    email: string;
    fullname: string;
    avatar?: string;
    role: string;
    currentSubscription?: {
        subscriptionId: string;
        planId: string;
        status: string;
        expiryDate: string;
    };
    createdAt: string;
}

interface SubscriptionStatus {
    hasSubscription: boolean;
    subscription?: {
        planName: string;
        startDate: string;
        endDate: string;
        daysRemaining: number;
        status: string;
        amount: number;
    };
}

interface ExpiryStatus {
    subscription?: {
        id: string;
        planName: string;
        amount: number;
        startDate: string;
        endDate: string;
    };
    statusInfo: {
        status: string;
        expiryDate: string;
        daysRemaining: number;
        showWarning: boolean;
        warningLevel: string;
        message: string;
        canRenew: boolean;
        recommendedAction: string;
        gracePeriodDays?: number;
    };
}

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserData | null>(null);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [expiryStatus, setExpiryStatus] = useState<ExpiryStatus | null>(null);
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [renewLoading, setRenewLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Password Management States
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch all data
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const [userData, subStatus, expStatus, history] = await Promise.all([
                api.getCurrentUser(),
                api.getSubscriptionStatus(),
                api.getExpiryStatus(),
                api.getPaymentHistory(1, 5)
            ]);

            setUser(userData.data);
            setSubscriptionStatus(subStatus.data);
            setExpiryStatus(expStatus.data);
            setPaymentHistory(history.data.history);

        } catch (error: any) {
            console.error("Error fetching profile data:", error);
            if (error.message?.includes("401")) {
                router.push("/login");
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Live countdown timer
    useEffect(() => {
        if (!subscriptionStatus?.subscription?.endDate) return;

        const calculateTimeRemaining = () => {
            const now = new Date().getTime();
            const expiry = new Date(subscriptionStatus.subscription!.endDate).getTime();
            const difference = expiry - now;

            if (difference <= 0) {
                setTimeRemaining("EXPIRED");
                fetchData();
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            if (days > 7) {
                setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
            } else if (days > 0) {
                setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
            }
        };

        calculateTimeRemaining();
        const interval = setInterval(calculateTimeRemaining, 1000);

        return () => clearInterval(interval);
    }, [subscriptionStatus, fetchData]);

    // Handle Password Change
    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            alert("Password must be at least 6 characters!");
            return;
        }

        setPasswordLoading(true);
        try {
            // API call to change password
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                    confirmPassword: passwordData.confirmPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to change password");
            }

            alert("✅ Password changed successfully!");
            setShowPasswordModal(false);
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (error: any) {
            alert(error.message || "Failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    // Handle Renewal
    const handleRenew = async () => {
        if (!expiryStatus?.subscription?.id) {
            alert("No subscription to renew");
            return;
        }

        setRenewLoading(true);

        try {
            const response = await api.renewSubscription(
                expiryStatus.subscription.id,
                ""
            );

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => {
                const options = {
                    key: response.data.key,
                    amount: response.data.amount,
                    currency: "INR",
                    name: "Fitness Club",
                    description: `Renew ${response.data.planName} Plan`,
                    order_id: response.data.orderId,
                    handler: async (razorpayResponse: any) => {
                        try {
                            await api.verifyPayment({
                                razorpay_order_id: razorpayResponse.razorpay_order_id,
                                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                                razorpay_signature: razorpayResponse.razorpay_signature,
                                subscriptionId: response.data.subscriptionId,
                            });

                            alert("🎉 Subscription renewed successfully!");
                            fetchData();
                        } catch (error: any) {
                            alert("Payment verification failed");
                        }
                    },
                    prefill: {
                        name: user?.fullname,
                        email: user?.email,
                    },
                    theme: {
                        color: "#A2CD04",
                    },
                };

                const razorpay = new (window as any).Razorpay(options);
                razorpay.open();
            };
        } catch (error: any) {
            alert(error.message || "Failed to initiate renewal");
        } finally {
            setRenewLoading(false);
        }
    };

    // Handle Logout
    const handleLogout = async () => {
        try {
            await api.logout();
            localStorage.removeItem("user");
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
            localStorage.removeItem("user");
            router.push("/login");
        }
    };

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "text-[#A2CD04] bg-[#A2CD04]/10 border-[#A2CD04]";
            case "grace_period": return "text-yellow-500 bg-yellow-500/10 border-yellow-500";
            case "expired": return "text-red-500 bg-red-500/10 border-red-500";
            default: return "text-gray-500 bg-gray-500/10 border-gray-500";
        }
    };

    // Get timer color
    const getTimerColor = () => {
        if (timeRemaining === "EXPIRED") return "text-red-500";
        if (!subscriptionStatus?.subscription?.daysRemaining) return "text-gray-500";

        const days = subscriptionStatus.subscription.daysRemaining;
        if (days <= 1) return "text-red-500 animate-pulse";
        if (days <= 3) return "text-orange-500";
        if (days <= 7) return "text-yellow-500";
        return "text-[#A2CD04]";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[#A2CD04]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-[#A2CD04] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float-delayed"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Profile Header */}
                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-800 p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Avatar */}
                        <div className="relative">
                            {user?.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.fullname}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-[#A2CD04] shadow-2xl"
                                />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#A2CD04] to-[#8EBF03] 
                              flex items-center justify-center shadow-2xl">
                                    <UserCircle className="w-20 h-20 text-black" />
                                </div>
                            )}
                            {user?.role === "admin" && (
                                <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-2 border-2 border-[#A2CD04]">
                                    <Shield className="w-6 h-6 text-[#A2CD04]" />
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-bold text-white mb-2">{user?.fullname}</h1>
                            <div className="flex flex-col md:flex-row gap-4 text-gray-400">
                                <span className="flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="w-4 h-4" />
                                    {user?.email}
                                </span>
                                <span className="flex items-center justify-center md:justify-start gap-2">
                                    <User className="w-4 h-4" />
                                    @{user?.username}
                                </span>
                                <span className="flex items-center justify-center md:justify-start gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Member since {new Date(user?.createdAt || "").toLocaleDateString()}
                                </span>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex gap-6 mt-6 justify-center md:justify-start">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[#A2CD04]">
                                        {subscriptionStatus?.hasSubscription ? "Active" : "Inactive"}
                                    </div>
                                    <div className="text-xs text-gray-500">Status</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">
                                        {paymentHistory.length}
                                    </div>
                                    <div className="text-xs text-gray-500">Payments</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">
                                        {subscriptionStatus?.subscription?.daysRemaining || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">Days Left</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Subscription Card */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Active Subscription Card */}
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-[#A2CD04]" />
                                    Subscription Details
                                </h2>
                                {subscriptionStatus?.hasSubscription && (
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(subscriptionStatus.subscription?.status || "")
                                        }`}>
                                        {subscriptionStatus.subscription?.status.toUpperCase()}
                                    </span>
                                )}
                            </div>

                            {subscriptionStatus?.hasSubscription ? (
                                <div className="space-y-6">
                                    {/* Plan Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-black/30 rounded-xl p-4">
                                            <p className="text-gray-400 text-sm mb-1">Current Plan</p>
                                            <p className="text-white text-xl font-bold">
                                                {subscriptionStatus.subscription?.planName}
                                            </p>
                                        </div>
                                        <div className="bg-black/30 rounded-xl p-4">
                                            <p className="text-gray-400 text-sm mb-1">Amount Paid</p>
                                            <p className="text-white text-xl font-bold">
                                                ₹{subscriptionStatus.subscription?.amount}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Timer Display */}
                                    <div className="bg-gradient-to-r from-[#A2CD04]/10 to-transparent rounded-xl p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Time Remaining
                                                </p>
                                                <p className={`text-3xl font-bold ${getTimerColor()}`}>
                                                    {timeRemaining}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-400 text-sm">Valid Till</p>
                                                <p className="text-white font-semibold">
                                                    {new Date(subscriptionStatus.subscription?.endDate || "").toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        {subscriptionStatus.subscription && (
                                            <div className="mt-4">
                                                <div className="w-full bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-[#A2CD04] to-[#8EBF03] h-2 rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${Math.max(0, Math.min(100,
                                                                ((new Date(subscriptionStatus.subscription.endDate).getTime() - new Date().getTime()) /
                                                                    (new Date(subscriptionStatus.subscription.endDate).getTime() - new Date(subscriptionStatus.subscription.startDate).getTime())) * 100
                                                            ))}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Warning Alert */}
                                    {expiryStatus?.statusInfo.showWarning && (
                                        <div className={`rounded-xl p-4 border ${expiryStatus.statusInfo.warningLevel === "critical"
                                            ? "bg-red-500/10 border-red-500 text-red-400"
                                            : expiryStatus.statusInfo.warningLevel === "high"
                                                ? "bg-orange-500/10 border-orange-500 text-orange-400"
                                                : "bg-yellow-500/10 border-yellow-500 text-yellow-400"
                                            }`}>
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold">{expiryStatus.statusInfo.message}</p>
                                                    <p className="text-sm mt-1 opacity-80">
                                                        {expiryStatus.statusInfo.recommendedAction}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Renewal Button */}
                                    {expiryStatus?.statusInfo?.canRenew &&
                                        ((expiryStatus?.statusInfo?.showWarning) || ((subscriptionStatus?.subscription?.daysRemaining ?? Number.POSITIVE_INFINITY) <= 7)) && (
                                            <button
                                                onClick={handleRenew}
                                                disabled={renewLoading}
                                                className="w-full bg-gradient-to-r from-[#A2CD04] to-[#8EBF03] text-black font-bold py-4 px-6 
                               rounded-xl hover:shadow-lg hover:shadow-[#A2CD04]/30 transition-all duration-300 
                               flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {renewLoading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCw className="w-5 h-5" />
                                                        <span>Renew Subscription Now</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <XCircle className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg mb-6">No active subscription found</p>
                                    <button
                                        onClick={() => router.push("/price")}
                                        className="bg-gradient-to-r from-[#A2CD04] to-[#8EBF03] text-black font-bold py-3 px-8 
                             rounded-xl hover:shadow-lg hover:shadow-[#A2CD04]/30 transition-all duration-300"
                                    >
                                        View Membership Plans
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Payment History */}
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-800 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <History className="w-6 h-6 text-[#A2CD04]" />
                                    Payment History
                                </h2>
                                {paymentHistory.length > 3 && (
                                    <button
                                        onClick={() => setShowHistory(!showHistory)}
                                        className="text-[#A2CD04] hover:text-[#8EBF03] text-sm font-medium transition-colors"
                                    >
                                        {showHistory ? "Show Less" : "Show All"}
                                    </button>
                                )}
                            </div>

                            {paymentHistory.length > 0 ? (
                                <div className="space-y-3">
                                    {paymentHistory.slice(0, showHistory ? undefined : 3).map((payment) => (
                                        <div key={payment._id} className="bg-black/30 rounded-xl p-4 hover:bg-black/40 transition-colors">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-white font-semibold">{payment.planName}</p>
                                                    <p className="text-gray-400 text-sm mt-1">
                                                        {new Date(payment.createdAt).toLocaleDateString()} at {new Date(payment.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[#A2CD04] font-bold text-lg">₹{payment.amount}</p>
                                                    <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${payment.status === "active"
                                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                                        : payment.status === "expired"
                                                            ? "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                                                            : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                        }`}>
                                                        {payment.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-center py-8">No payment history available</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Quick Actions & Stats */}
                    <div className="space-y-8">
                        {/* Security Settings Card */}
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-800 p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[#A2CD04]" />
                                Security Settings
                            </h3>

                            {/* Change Password Button */}
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="w-full bg-black/30 hover:bg-[#A2CD04]/10 text-white py-3 px-4 rounded-xl 
                                         transition-all duration-300 flex items-center justify-between group mb-3"
                            >
                                <span className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-[#A2CD04]" />
                                    Change Password
                                </span>
                                <span className="text-gray-500 group-hover:text-[#A2CD04] transition-colors">→</span>
                            </button>

                            {/* Password Info */}
                            <div className="text-xs text-gray-400 px-2 space-y-1">
                                <p>Password security: <span className="text-[#A2CD04]">Strong</span></p>
                                <p>Two-factor: <span className="text-gray-500">Not enabled</span></p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-800 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => router.push("/price")}
                                    className="w-full bg-black/30 hover:bg-[#A2CD04]/10 text-white py-3 px-4 rounded-xl 
                           transition-all duration-300 flex items-center justify-between group"
                                >
                                    <span className="flex items-center gap-3">
                                        <Trophy className="w-5 h-5 text-[#A2CD04]" />
                                        View Plans
                                    </span>
                                    <span className="text-gray-500 group-hover:text-[#A2CD04] transition-colors">→</span>
                                </button>

                                <button
                                    onClick={() => router.push("/trainers")}
                                    className="w-full bg-black/30 hover:bg-[#A2CD04]/10 text-white py-3 px-4 rounded-xl 
                           transition-all duration-300 flex items-center justify-between group"
                                >
                                    <span className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-[#A2CD04]" />
                                        Our Trainers
                                    </span>
                                    <span className="text-gray-500 group-hover:text-[#A2CD04] transition-colors">→</span>
                                </button>

                                <button
                                    onClick={() => router.push("/products")}
                                    className="w-full bg-black/30 hover:bg-[#A2CD04]/10 text-white py-3 px-4 rounded-xl 
                           transition-all duration-300 flex items-center justify-between group"
                                >
                                    <span className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-[#A2CD04]" />
                                        Products
                                    </span>
                                    <span className="text-gray-500 group-hover:text-[#A2CD04] transition-colors">→</span>
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 px-4 rounded-xl 
                           transition-all duration-300 flex items-center justify-between group border border-red-500/30"
                                >
                                    <span className="flex items-center gap-3">
                                        <XCircle className="w-5 h-5" />
                                        Logout
                                    </span>
                                    <span className="text-red-400/50 group-hover:text-red-400 transition-colors">→</span>
                                </button>
                            </div>
                        </div>

                        {/* Achievement Badges */}
                        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-800 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Achievements</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <div className="w-12 h-12 mx-auto bg-[#A2CD04]/20 rounded-full flex items-center justify-center mb-2">
                                        <Star className="w-6 h-6 text-[#A2CD04]" />
                                    </div>
                                    <p className="text-xs text-gray-400">Member</p>
                                </div>
                                {subscriptionStatus?.hasSubscription && (
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto bg-[#A2CD04]/20 rounded-full flex items-center justify-center mb-2">
                                            <Trophy className="w-6 h-6 text-[#A2CD04]" />
                                        </div>
                                        <p className="text-xs text-gray-400">Active</p>
                                    </div>
                                )}
                                {paymentHistory.length >= 3 && (
                                    <div className="text-center">
                                        <div className="w-12 h-12 mx-auto bg-[#A2CD04]/20 rounded-full flex items-center justify-center mb-2">
                                            <Zap className="w-6 h-6 text-[#A2CD04]" />
                                        </div>
                                        <p className="text-xs text-gray-400">Loyal</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="bg-gradient-to-r from-[#A2CD04]/20 to-transparent rounded-2xl border border-[#A2CD04]/30 p-6">
                            <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Our support team is here to help you 24/7
                            </p>
                            <button
                                onClick={() => router.push("/contact")}
                                className="text-[#A2CD04] hover:text-[#8EBF03] font-semibold text-sm transition-colors"
                            >
                                Contact Support →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-gray-800 p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <KeyRound className="w-6 h-6 text-[#A2CD04]" />
                            Change Password
                        </h2>

                        <div className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 pr-12 rounded-xl bg-black/30 border border-gray-700 text-white 
                                                 placeholder-gray-500 focus:outline-none focus:border-[#A2CD04] transition-colors"
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 pr-12 rounded-xl bg-black/30 border border-gray-700 text-white 
                                                 placeholder-gray-500 focus:outline-none focus:border-[#A2CD04] transition-colors"
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-gray-400 text-sm mb-2 block">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 pr-12 rounded-xl bg-black/30 border border-gray-700 text-white 
                                                 placeholder-gray-500 focus:outline-none focus:border-[#A2CD04] transition-colors"
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-black/20 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-2">Password requirements:</p>
                                <ul className="text-xs space-y-1">
                                    <li className={`flex items-center gap-2 ${passwordData.newPassword.length >= 6 ? 'text-[#A2CD04]' : 'text-gray-500'}`}>
                                        <CheckCircle className="w-3 h-3" />
                                        At least 6 characters
                                    </li>
                                    <li className={`flex items-center gap-2 ${passwordData.newPassword === passwordData.confirmPassword && passwordData.newPassword.length > 0 ? 'text-[#A2CD04]' : 'text-gray-500'}`}>
                                        <CheckCircle className="w-3 h-3" />
                                        Passwords match
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowPasswordModal(false);
                                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                }}
                                className="flex-1 py-3 px-4 rounded-xl bg-gray-700 hover:bg-gray-600 text-white 
                                         font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                disabled={passwordLoading || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#A2CD04] to-[#8EBF03] 
                                         text-black font-semibold hover:shadow-lg hover:shadow-[#A2CD04]/30 
                                         transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {passwordLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Changing...</span>
                                    </>
                                ) : (
                                    <span>Change Password</span>
                                )}
                            </button>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-center mt-4">
                            <Link href="/forgot-password" className="text-[#A2CD04] hover:text-[#8EBF03] text-sm transition-colors">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0);
                    }
                    33% {
                        transform: translate(20px, -20px);
                    }
                    66% {
                        transform: translate(-20px, 15px);
                    }
                }

                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }

                .animate-float-delayed {
                    animation: float 8s ease-in-out infinite;
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}