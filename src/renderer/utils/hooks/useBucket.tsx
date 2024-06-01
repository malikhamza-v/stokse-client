import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const useBucket = () => {
  const [uploadLoading, setUploadLoading] = useState(false);
  const [retrieveLoading, setRetrieveLoading] = useState(false);

  const store = useSelector((state: any) => state.app.store);

  const s3Client = new S3Client({
    endpoint: 'https://nyc3.digitaloceanspaces.com',
    forcePathStyle: false,
    region: 'nyc3',
    credentials: {
      accessKeyId: 'DO002Q6X8T3DUQUHRPDD',
      secretAccessKey: 'ojyA09T6q45ut5THfYl3IX04vKDxl0IAV7rOpbnbHoA',
    },
  });

  const formatString = (string: string) => {
    return string.toLowerCase().replace(/\s+/g, '-');
  };

  const getSignedUrlForImage = async (objectKey: string) => {
    return s3Client
      .send(
        new HeadObjectCommand({
          Bucket: 'pos-inventory',
          Key: objectKey,
        }),
      )
      .then(async (existence) => {
        if (existence.$metadata.httpStatusCode === 200) {
          const command = new GetObjectCommand({
            Bucket: 'pos-inventory',
            Key: objectKey,
          });
          const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });
          return signedUrl;
        }
        return false;
      })
      .catch(() => {
        return null;
      });
  };

  const uploadImage = async (image: any, id: number, productName: string) => {
    const params: any = {
      Bucket: 'pos-inventory',
      Key: `${formatString(store.store_name)}/barcodes/${id}-@${formatString(
        productName,
      )}`,
      Body: image,
      ACL: 'private',
      ContentType: 'image/png',
    };
    setUploadLoading(true);
    try {
      await s3Client.send(new PutObjectCommand(params));
      return 200;
    } catch (e) {
      return false;
    } finally {
      setUploadLoading(false);
    }
  };

  const retrieveImages = async () => {
    const imageFormats = ['.png', '.jpeg', '.jpg', '.webp'];
    const params = {
      Bucket: 'pos-inventory',
      Prefix: `${formatString(store.store_name)}/barcodes`,
    };

    try {
      setRetrieveLoading(true);
      const data = await s3Client.send(new ListObjectsV2Command(params));
      if (data.Contents) {
        const images = await Promise.all(
          data.Contents.map(async (object: any) => {
            if (imageFormats.some((format) => object.Key.endsWith(format))) {
              const signedUrl = await getSignedUrlForImage(object.Key);

              return { url: signedUrl, image: object.Key };
            }
            return null;
          }),
        );

        return { status: 200, data: images.filter((url) => url !== null) };
      }
      return false;
    } catch (e) {
      return false;
    } finally {
      setRetrieveLoading(false);
    }
  };

  return {
    uploadLoading,
    uploadImage,
    retrieveLoading,
    retrieveImages,
    getSignedUrlForImage,
  };
};

export default useBucket;
