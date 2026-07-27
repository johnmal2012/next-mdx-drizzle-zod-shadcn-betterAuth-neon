import { getActivePhysicianProfile } from "@/lib/profile/get-physician-profile";
import { getActivePhysicianSections } from "@/lib/sections/get-physician-sections";
import { buildNavItems } from "@/lib/sections/get-navitems";

// moving all page data loading into one service
export async function getWebsiteData() {
    const [profile, sections] = await Promise.all([
        getActivePhysicianProfile(),
        getActivePhysicianSections(),
    ]);

    return {
        profile,
        sections,
        navItems: sections ? buildNavItems(sections) : [],
    };
}