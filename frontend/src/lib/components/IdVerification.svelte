<script lang="ts">
    import { Camera, Upload, X, Check, AlertCircle } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let selectedFile: File | null = null;
    let previewUrl: string | null = null;
    let isUploading = false;
    let error = "";
    let success = false;

    // Camera functionality
    let videoElement: HTMLVideoElement;
    let canvasElement: HTMLCanvasElement;
    let stream: MediaStream | null = null;
    let showCamera = false;

    const acceptedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    const maxFileSize = 10 * 1024 * 1024; // 10MB

    function handleFileSelect(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (file) {
            validateAndSetFile(file);
        }
    }

    function validateAndSetFile(file: File) {
        error = "";

        // Check file type
        if (!acceptedTypes.includes(file.type)) {
            error = "Please select a valid image file (JPEG, PNG, or WebP)";
            return;
        }

        // Check file size
        if (file.size > maxFileSize) {
            error = "File size must be less than 10MB";
            return;
        }

        selectedFile = file;
        previewUrl = URL.createObjectURL(file);
        success = false;
    }

    function removeFile() {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        selectedFile = null;
        previewUrl = null;
        success = false;
        error = "";
    }

    async function startCamera() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: "environment",
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
            });

            if (videoElement) {
                videoElement.srcObject = stream;
                showCamera = true;
            }
        } catch (err) {
            error = "Unable to access camera. Please upload a file instead.";
        }
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
            stream = null;
        }
        showCamera = false;
    }

    function capturePhoto() {
        if (videoElement && canvasElement) {
            const context = canvasElement.getContext("2d");
            if (context) {
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
                context.drawImage(videoElement, 0, 0);

                canvasElement.toBlob(
                    (blob) => {
                        if (blob) {
                            const file = new File([blob], "id-photo.jpg", {
                                type: "image/jpeg",
                            });
                            validateAndSetFile(file);
                            stopCamera();
                        }
                    },
                    "image/jpeg",
                    0.8,
                );
            }
        }
    }

    function handleSubmit() {
        if (!selectedFile) {
            error = "Please upload or capture a photo of your ID";
            return;
        }

        isUploading = true;
        error = "";

        // Simulate upload process
        setTimeout(() => {
            isUploading = false;
            success = true;
            dispatch("verified", { file: selectedFile });
        }, 2000);
    }

    // Cleanup on component destroy
    import { onDestroy } from "svelte";

    onDestroy(() => {
        stopCamera();
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    });
</script>

<div class="id-verification">
    <div class="verification-header">
        <h3>ID Verification</h3>
        <p>Please upload a photo of your ID to verify your age and identity. Accepted documents include: Driver's License, Health Card, Passport</p>
    </div>


    {#if error}
        <div class="error-message">
            <AlertCircle size={16} />
            {error}
        </div>
    {/if}

    {#if success}
        <div class="success-message">
            <Check size={16} />
            ID verification successful!
        </div>
    {/if}

    {#if !previewUrl && !showCamera}
        <div class="upload-options">
            <div
                class="upload-option"
                on:click={() => document.getElementById("file-input")?.click()}
            >
                <div class="upload-icon">
                    <Upload size={32} />
                </div>
                <h4>Upload Photo</h4>
                <p>Choose a photo from your device</p>
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    on:change={handleFileSelect}
                    style="display: none;"
                />
            </div>

            <div class="upload-option" on:click={startCamera}>
                <div class="upload-icon">
                    <Camera size={32} />
                </div>
                <h4>Take Photo</h4>
                <p>Use your camera to capture your ID</p>
            </div>
        </div>
    {/if}

    {#if showCamera}
        <div class="camera-container">
            <div class="camera-header">
                <h4>Take Photo of Your ID</h4>
                <button class="close-btn" on:click={stopCamera}>
                    <X size={20} />
                </button>
            </div>

            <div class="camera-view">
                <video bind:this={videoElement} autoplay playsinline muted
                ></video>
                <div class="camera-overlay">
                    <div class="id-frame"></div>
                    <p>Position your ID within the frame</p>
                </div>
            </div>

            <div class="camera-controls">
                <button class="btn btn-outline" on:click={stopCamera}>
                    Cancel
                </button>
                <button class="btn btn-primary" on:click={capturePhoto}>
                    Capture Photo
                </button>
            </div>

            <canvas bind:this={canvasElement} style="display: none;"></canvas>
        </div>
    {/if}

    {#if previewUrl}
        <div class="preview-container">
            <div class="preview-header">
                <h4>ID Preview</h4>
                <button class="remove-btn" on:click={removeFile}>
                    <X size={16} />
                </button>
            </div>

            <div class="preview-image">
                <img src={previewUrl} alt="ID Preview" />
            </div>

            <div class="preview-info">
                <p><strong>File:</strong> {selectedFile?.name}</p>
                <p>
                    <strong>Size:</strong>
                    {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                </p>
            </div>
        </div>
    {/if}

    <div class="verification-footer">
        <button
            class="btn btn-primary"
            on:click={handleSubmit}
            disabled={!selectedFile || isUploading}
        >
            {#if isUploading}
                Verifying...
            {:else}
                Verify ID
            {/if}
        </button>
    </div>
</div>

<style>
    .id-verification {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .verification-header {
        text-align: center;
    }

    .verification-header h3 {
        color: var(--text);
        margin-bottom: 0.5rem;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .verification-header p {
        color: var(--text-secondary);
        margin: 0;
        font-size: 1rem;
    }

    .accepted-ids {
        background: var(--surface);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        border: 1px solid var(--border);
    }

    .accepted-ids h4 {
        color: var(--text);
        margin-bottom: 1rem;
        font-size: 1rem;
        font-weight: 600;
    }

    .id-types {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
    }

    .id-type {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        text-align: center;
    }

    .id-icon {
        font-size: 2rem;
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: var(--radius-md);
        border: 2px solid var(--border);
    }

    .id-type span {
        font-size: 0.85rem;
        color: var(--text-secondary);
        font-weight: 500;
    }

    .upload-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .upload-option {
        border: 2px dashed var(--border);
        border-radius: var(--radius-lg);
        padding: 2rem 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: all var(--transition-fast);
        background: white;
    }

    .upload-option:hover {
        border-color: var(--primary);
        background: var(--primary-light);
        transform: translateY(-2px);
    }

    .upload-icon {
        color: var(--primary);
        margin-bottom: 1rem;
    }

    .upload-option h4 {
        color: var(--text);
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .upload-option p {
        color: var(--text-secondary);
        margin: 0;
        font-size: 0.9rem;
    }

    .camera-container {
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: white;
    }

    .camera-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: var(--surface);
        border-bottom: 1px solid var(--border);
    }

    .camera-header h4 {
        color: var(--text);
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .close-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
    }

    .close-btn:hover {
        background: var(--surface-hover);
        color: var(--text);
    }

    .camera-view {
        position: relative;
        width: 100%;
        height: 300px;
        background: #000;
    }

    .camera-view video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .camera-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        text-align: center;
    }

    .id-frame {
        width: 280px;
        height: 180px;
        border: 2px solid white;
        border-radius: var(--radius-md);
        margin-bottom: 1rem;
        position: relative;
    }

    .id-frame::before {
        content: "";
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: var(--radius-md);
    }

    .camera-overlay p {
        margin: 0;
        font-size: 0.9rem;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
    }

    .camera-controls {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.5rem;
        background: var(--surface);
    }

    .preview-container {
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        overflow: hidden;
        background: white;
    }

    .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        background: var(--surface);
        border-bottom: 1px solid var(--border);
    }

    .preview-header h4 {
        color: var(--text);
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
    }

    .remove-btn {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
    }

    .remove-btn:hover {
        background: var(--error-light);
        color: var(--error);
    }

    .preview-image {
        padding: 1.5rem;
        text-align: center;
    }

    .preview-image img {
        max-width: 100%;
        max-height: 300px;
        border-radius: var(--radius-md);
        border: 1px solid var(--border);
    }

    .preview-info {
        padding: 1rem 1.5rem;
        background: var(--surface);
        border-top: 1px solid var(--border);
    }

    .preview-info p {
        margin: 0.25rem 0;
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    .verification-footer {
        display: flex;
        justify-content: center;
        margin-top: 1rem;
    }

    .error-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--error-light);
        color: var(--error);
        padding: 0.75rem;
        border-radius: var(--radius-md);
        border: 1px solid #fecaca;
        font-size: 0.9rem;
    }

    .success-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--success-light);
        color: var(--success);
        padding: 0.75rem;
        border-radius: var(--radius-md);
        border: 1px solid #bbf7d0;
        font-size: 0.9rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius-md);
        font-weight: 500;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all var(--transition-fast);
        border: none;
        min-width: 120px;
    }

    .btn-primary {
        background: var(--primary);
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: var(--primary-dark);
        transform: translateY(-1px);
    }

    .btn-primary:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    .btn-outline {
        background: white;
        color: var(--text);
        border: 2px solid var(--border);
    }

    .btn-outline:hover {
        border-color: var(--primary);
        color: var(--primary);
    }

    @media (max-width: 600px) {
        .upload-options {
            grid-template-columns: 1fr;
        }

        .id-types {
            grid-template-columns: repeat(3, 1fr);
        }

        .camera-view {
            height: 250px;
        }

        .id-frame {
            width: 240px;
            height: 150px;
        }

        .camera-controls {
            flex-direction: column;
        }
    }
</style>
