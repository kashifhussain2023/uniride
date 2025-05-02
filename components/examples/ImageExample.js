import SafeImage from '../common/SafeImage';

export default function ImageExample() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Image Examples</h2>

      {/* Example 1: Using a direct URL */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Direct URL Example</h3>
        <SafeImage
          src="/line.png"
          alt="Line Image"
          width={200}
          height={100}
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Example 2: Using path and filename */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Path and Filename Example</h3>
        <SafeImage
          src={{ filename: 'line.png', path: '/' }}
          alt="Line Image with Path"
          width={200}
          height={100}
          className="rounded-lg shadow-md"
        />
      </div>

      {/* Example 3: With fallback image */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Fallback Image Example</h3>
        <SafeImage
          src="/non-existent-image.png"
          alt="Non-existent Image"
          width={200}
          height={100}
          fallbackSrc="/avatar.png"
          className="rounded-lg shadow-md"
        />
      </div>
    </div>
  );
}
