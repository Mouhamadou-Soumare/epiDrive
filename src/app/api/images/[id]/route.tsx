import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextResponse, { params }: { params: { id: string } }) {
    const { id } = params;

    console.log("Received id:", id);   

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    try {
        console.log("Searching for image with id:", id);

        const image = await prisma.image.findUnique({
            where: { id: parseInt(id) },
        });

        if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

        console.log('GET API/image/' + id + ': image found:', image);
        return NextResponse.json(image);
    } catch (error) {
        console.error("Error fetching image:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: NextResponse, { params }: { params: { id: string } }) {
    const { id } = params;
    const data = await req.json();

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const { path, ...updateData } = data;

    try {
        const existingImage = await prisma.image.findUnique({
            where: { id: parseInt(id) },
        });

        if (!existingImage) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

        // Update the image
        const updatedImage = await prisma.image.update({
            where: { id: parseInt(id) },
            data: {
                path,
                ...updateData,
            },
        });

        console.log('PATCH API/image/' + id + ': image updated:', updatedImage);
        return NextResponse.json(updatedImage);
    } catch (error: any) {
        console.error("Error updating image:", error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextResponse, { params }: { params: { id: string } }) {
    const { id } = params;

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    try {
        await prisma.image.delete({
            where: { id: parseInt(id) },
        });

        console.log('DELETE API/image/' + id + ': image deleted');
        return NextResponse.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
