import type {  PhysicianSections } from '@/lib/types/physician-section'

export function buildNavItems(
    sections: PhysicianSections[],
) {
    return sections.map(({ slug }) => ({
        id: slug,
    }));
}