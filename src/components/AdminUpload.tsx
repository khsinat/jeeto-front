import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Eye, Trash2, CheckCircle, AlertCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { databases, storage, account, ID, functions } from '@/lib/appwrite';
import { Permission, Role } from 'appwrite';

interface UploadedImage {
  $id: string;
  fileId: string;
  answer: string;
  uploadedAt: string;
  used: 'unused' | 'current' | 'used';
}

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const BUCKET_ID = 'images';
const DATABASE_ID = '685d619e00286d9805b7';
const IMAGES_COLLECTION_ID = 'images';

const AdminUpload: React.FC = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<UploadedImage | null>(null);
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const fetchUploadedImages = async () => {
    try {
      setIsLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        IMAGES_COLLECTION_ID,
        []
      );
      setUploadedImages(response.documents as unknown as UploadedImage[]);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to fetch uploaded images');
    } finally {
      setIsLoading(false);
    }
  };

  // Only allow one file at a time for answer association
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    if (!answer.trim()) {
      toast.error('Please provide an answer for the image.');
      return;
    }
    setUploadProgress([{ fileName: acceptedFiles[0].name, progress: 0, status: 'uploading' }]);
    setIsLoading(true);
    try {
      // 1. Upload file to storage
      const file = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        acceptedFiles[0],
        [Permission.read(Role.any())] // Make image publicly readable
      );
      // 2. Create document in images collection
      await databases.createDocument(
        DATABASE_ID,
        IMAGES_COLLECTION_ID,
        ID.unique(),
        {
          fileId: file.$id,
          answer: answer.trim(),
          uploadedAt: new Date().toISOString(),
          used: 'unused',
        }
      );
      
      // 3. Try to create a new game if no active game exists
      try {
        await functions.createExecution('maybeStartGame', JSON.stringify({}));
        toast.success(`${acceptedFiles[0].name} uploaded successfully and checked for new game!`);
      } catch (gameError) {
        console.log('maybeStartGame function call failed', gameError);
        toast.success(`${acceptedFiles[0].name} uploaded successfully!`);
      }
      
      setAnswer('');
      await fetchUploadedImages();
    } catch (error) {
      setUploadProgress([{ fileName: acceptedFiles[0].name, progress: 0, status: 'error', error: 'Upload failed' }]);
      toast.error('Failed to upload image');
    } finally {
      setIsLoading(false);
      setTimeout(() => setUploadProgress([]), 3000);
    }
  }, [answer]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const deleteImage = async (image: UploadedImage) => {
    try {
      await storage.deleteFile(BUCKET_ID, image.fileId);
      await databases.deleteDocument(
        DATABASE_ID,
        IMAGES_COLLECTION_ID,
        image.$id
      );
      toast.success('Image deleted successfully');
      await fetchUploadedImages();
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const getImageUrl = (fileId: string) => {
    return storage.getFileView(BUCKET_ID, fileId);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Image Upload</h1>
          <p className="text-muted-foreground">
            Upload and manage images for the betting game
          </p>
        </div>
        <Badge variant="secondary">
          {uploadedImages.filter(img => img.used === 'unused').length} unused images
        </Badge>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="manage">Manage Images</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
              <CardDescription>
                Drag and drop an image here or click to select a file. <br />
                Maximum file size: 10MB. Supported formats: JPEG, PNG, GIF, WebP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  // Trigger dropzone file dialog
                  (document.querySelector('input[type="file"]') as HTMLInputElement)?.click();
                }}
                className="space-y-4"
              >
                <Label htmlFor="answer">Answer</Label>
                <Input
                  id="answer"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder="Enter the correct answer for this image"
                  required
                  className="mb-2"
                />
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  {isDragActive ? (
                    <p className="text-lg font-medium">Drop the file here...</p>
                  ) : (
                    <div>
                      <p className="text-lg font-medium mb-2">
                        Drag & drop an image here
                      </p>
                      <p className="text-muted-foreground">
                        or click to select a file
                      </p>
                    </div>
                  )}
                </div>
                {uploadProgress.length > 0 && (
                  <div className="pt-4">
                    {uploadProgress.map((item) => (
                      <div key={item.fileName} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{item.fileName}</span>
                          <div className="flex items-center gap-2">
                            {item.status === 'uploading' && (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            {item.status === 'success' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {item.status === 'error' && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                        {item.error && (
                          <p className="text-sm text-red-500">{item.error}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Image Management</CardTitle>
              <CardDescription>
                View, delete, and check status of uploaded images
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : uploadedImages.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No images uploaded yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedImages.map((image) => (
                    <Card key={image.$id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <img
                          src={getImageUrl(image.fileId)}
                          alt={image.answer}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 w-8 p-0"
                                onClick={() => setSelectedImage(image)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Image Details</DialogTitle>
                                <DialogDescription>
                                  View image information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="aspect-video relative">
                                  <img
                                    src={getImageUrl(image.fileId)}
                                    alt={image.answer}
                                    className="w-full h-full object-contain rounded-lg"
                                  />
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <span className="font-medium">Answer:</span>
                                    <p className="text-muted-foreground">{image.answer}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium">Status:</span>
                                    <Badge variant={
                                      image.used === 'current' ? 'default' :
                                      image.used === 'used' ? 'destructive' : 'secondary'
                                    }>
                                      {image.used}
                                    </Badge>
                                  </div>
                                  <div>
                                    <span className="font-medium">Uploaded:</span>
                                    <p className="text-muted-foreground">
                                      {new Date(image.uploadedAt).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              setImageToDelete(image);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        {image.used !== 'unused' && (
                          <div className="absolute bottom-2 left-2">
                            <Badge variant={image.used === 'used' ? 'destructive' : 'default'}>{image.used}</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-3">
                        {/* <p className="text-sm font-medium truncate">Answer: {image.answer}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {new Date(image.uploadedAt).toLocaleString()}
                        </p> */}
                        <p className="text-xs text-muted-foreground">
                          Status: <Badge variant={
                            image.used === 'current' ? 'default' :
                            image.used === 'used' ? 'destructive' : 'secondary'
                          }>{image.used}</Badge>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setImageToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => imageToDelete && deleteImage(imageToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUpload;