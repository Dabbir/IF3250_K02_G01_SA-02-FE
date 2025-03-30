import {
    Home,
    Database,
    Newspaper,
    Leaf,
    Users,
    HandCoins,
    User,
    Image,
    BarChart3,
    FileBarChart,
    GraduationCap,
    Eye,
} from "lucide-react"

// Dashboard.
export const dashboard = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Dashboard Admin",
        url: "/dashboard-admin",
        icon: Home,
    },
]

// Menu items.
export const programs = [
    {
        title: "Akun",
        url: "/akun-manajemen",
        icon: User,
    },
    {
        title: "Data Program",
        url: "/data-program",
        icon: Database,
    },
    {
        title: "Publikasi",
        url: "/publikasi",
        icon: Newspaper,
    },
    {
        title: "Kegiatan",
        url: "/kegiatan",
        icon: Leaf,
    },
    {
        title: "Stakeholder",
        url: "/stakeholder",
        icon: Users,
    },
    {
        title: "Penerima Manfaat",
        url: "/penerima-manfaat",
        icon: HandCoins,
    },
    {
        title: "Karyawan",
        url: "/karyawan",
        icon: Users,
    },
    {
        title: "Galeri",
        url: "/galeri",
        icon: Image,
    },
]

export const reportItems = [
    {
        title: "Laporan Program",
        url: "/laporan-program",
        icon: BarChart3,
    },
    {
        title: "Laporan Kegiatan",
        url: "/laporan-kegiatan",
        icon: FileBarChart,
    },
]

export const training = [
    {
        title: "Pelatihan",
        url: "/pelatihan",
        icon: GraduationCap,
    },
]

export const viewerAccess = [
    {
        title: "Viewer Access",
        url: "/viewer-access",
        icon: Eye,
    },
]