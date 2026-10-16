import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { X, Heart, ZoomIn, ZoomOut, RotateCcw, Play, Pause, ChevronLeft, ChevronRight, MessageCircle, Send } from 'lucide-react';

export default function ProductModal({
  isOpen,
  onClose,
  productKey,
  products,
  onSelectProduct,
  initialMode = '2d',
  wishlist,
  onToggleWishlist,
  onInquireFromModal,
}) {
  const [viewMode, setViewMode] = useState(initialMode); // '2d' or '3d'
  const [isZoomed, setIsZoomed] = useState(false);
  const [angleDeg, setAngleDeg] = useState(0);
  const [tiltDeg, setTiltDeg] = useState(0);
  const [zoomScale, setZoomScale] = useState(1.0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  const canvasContainerRef = useRef(null);
  const threeRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    bagGroup: null,
    bodyMesh: null,
    textureLoader: null,
    animFrameId: null,
  });

  const product = products[productKey] || Object.values(products)[0];
  const isWishlisted = wishlist.includes(productKey);
  const productKeys = Object.keys(products);
  const currentIndex = productKeys.indexOf(productKey);

  // Sync initial mode
  useEffect(() => {
    if (isOpen) {
      setViewMode(initialMode || '2d');
      setIsZoomed(false);
      setAngleDeg(0);
      setTiltDeg(0);
      setZoomScale(1.0);
      setIsAutoRotating(false);
    }
  }, [isOpen, initialMode, productKey]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') handleNavigate(-1);
      else if (e.key === 'ArrowRight') handleNavigate(1);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, currentIndex, productKeys]);

  const handleNavigate = (dir) => {
    const nextIdx = (currentIndex + dir + productKeys.length) % productKeys.length;
    const nextKey = productKeys[nextIdx];
    onSelectProduct(nextKey);
    setIsZoomed(false);
  };

  // ==========================================================================
  // Three.js 3D WebGL Setup
  // ==========================================================================
  useEffect(() => {
    if (!isOpen || viewMode !== '3d' || !canvasContainerRef.current) return;

    const container = canvasContainerRef.current;
    const width = container.clientWidth || 560;
    const height = container.clientHeight || 380;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.8);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.3);
    keyLight.position.set(4, 5, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xbcd8ff, 0.65);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    const bounceLight = new THREE.DirectionalLight(0xfef08a, 0.35);
    bounceLight.position.set(0, -3, 3);
    scene.add(bounceLight);

    // 4. Bag 3D Mesh Construction
    const bagGroup = new THREE.Group();
    scene.add(bagGroup);

    // Curved crescent profile
    const shape = new THREE.Shape();
    shape.moveTo(-1.8, 0.4);
    shape.bezierCurveTo(-1.8, -1.8, 1.8, -1.8, 1.8, 0.4);
    shape.bezierCurveTo(1.0, -0.4, -1.0, -0.4, -1.8, 0.4);

    const extrudeSettings = {
      steps: 3,
      depth: 0.8,
      bevelEnabled: true,
      bevelThickness: 0.22,
      bevelSize: 0.18,
      bevelSegments: 5,
    };

    const bodyGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    bodyGeo.center();

    // UV projection for handloom texture
    bodyGeo.computeBoundingBox();
    const min = bodyGeo.boundingBox.min;
    const max = bodyGeo.boundingBox.max;
    const uvAttr = bodyGeo.attributes.uv;
    const posAttr = bodyGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const u = (x - min.x) / (max.x - min.x);
      const v = (y - min.y) / (max.y - min.y);
      uvAttr.setXY(i, u, v);
    }
    bodyGeo.attributes.uv.needsUpdate = true;

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.55,
      metalness: 0.08,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    bagGroup.add(bodyMesh);

    // Brass Zipper Curve
    const zipCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.65, 0.38, 0),
      new THREE.Vector3(-0.9, -0.22, 0),
      new THREE.Vector3(0, -0.28, 0),
      new THREE.Vector3(0.9, -0.22, 0),
      new THREE.Vector3(1.65, 0.38, 0),
    ]);
    const zipGeo = new THREE.TubeGeometry(zipCurve, 32, 0.045, 8, false);
    const zipMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.92, roughness: 0.25 });
    const zipper = new THREE.Mesh(zipGeo, zipMat);
    bagGroup.add(zipper);

    // Ergonomic Shoulder Strap
    const strapCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.7, 0.35, 0),
      new THREE.Vector3(-1.45, 2.1, 0),
      new THREE.Vector3(0, 2.65, 0),
      new THREE.Vector3(1.45, 2.1, 0),
      new THREE.Vector3(1.7, 0.35, 0),
    ]);
    const strapGeo = new THREE.TubeGeometry(strapCurve, 40, 0.085, 10, false);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x3d2012, roughness: 0.45, metalness: 0.15 });
    const strap = new THREE.Mesh(strapGeo, strapMat);
    bagGroup.add(strap);

    // Soft Studio Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.18)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(5.2, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.05;
    scene.add(shadowMesh);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();
    if (product && product.img) {
      textureLoader.load(
        product.img,
        (tex) => {
          tex.wrapS = THREE.RepeatWrapping;
          tex.wrapT = THREE.RepeatWrapping;
          tex.repeat.set(1, 1);
          bodyMat.map = tex;
          bodyMat.needsUpdate = true;
        },
        undefined,
        (err) => console.warn('3D Texture fallback:', err)
      );
    }

    // Touch & Mouse Drag Rotation
    let isDragging = false;
    let prevX = 0;
    const canvasEl = renderer.domElement;

    const onMouseDown = (e) => {
      isDragging = true;
      prevX = e.clientX;
      setIsAutoRotating(false);
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      prevX = e.clientX;
      setAngleDeg((prev) => {
        const next = (prev + deltaX * 0.7 + 360) % 360;
        bagGroup.rotation.y = THREE.MathUtils.degToRad(next);
        return next;
      });
    };

    const onMouseUp = () => { isDragging = false; };

    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevX = e.touches[0].clientX;
        setIsAutoRotating(false);
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevX;
      prevX = e.touches[0].clientX;
      setAngleDeg((prev) => {
        const next = (prev + deltaX * 0.7 + 360) % 360;
        bagGroup.rotation.y = THREE.MathUtils.degToRad(next);
        return next;
      });
    };

    canvasEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    canvasEl.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onMouseUp);

    threeRef.current = {
      scene,
      camera,
      renderer,
      bagGroup,
      bodyMesh,
      textureLoader,
      animFrameId: null,
    };

    // Animation Loop
    const animate = () => {
      threeRef.current.animFrameId = requestAnimationFrame(animate);
      if (threeRef.current.bagGroup && isAutoRotating) {
        setAngleDeg((prev) => {
          const next = (prev + 0.5) % 360;
          threeRef.current.bagGroup.rotation.y = THREE.MathUtils.degToRad(next);
          return next;
        });
      }
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (threeRef.current.animFrameId) cancelAnimationFrame(threeRef.current.animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [isOpen, viewMode, productKey, isAutoRotating]);

  // Update texture when product changes in 3D
  useEffect(() => {
    if (viewMode === '3d' && threeRef.current.bodyMesh && threeRef.current.textureLoader && product?.img) {
      threeRef.current.textureLoader.load(product.img, (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
        threeRef.current.bodyMesh.material.map = tex;
        threeRef.current.bodyMesh.material.needsUpdate = true;
      });
    }
  }, [productKey, viewMode]);

  // Sliders handler
  const handleAngleChange = (e) => {
    const val = parseFloat(e.target.value);
    setAngleDeg(val);
    setIsAutoRotating(false);
    if (threeRef.current.bagGroup) {
      threeRef.current.bagGroup.rotation.y = THREE.MathUtils.degToRad(val);
    }
  };

  const handleTiltChange = (e) => {
    const val = parseFloat(e.target.value);
    setTiltDeg(val);
    if (threeRef.current.bagGroup) {
      threeRef.current.bagGroup.rotation.x = THREE.MathUtils.degToRad(val);
    }
  };

  const handleZoomChange = (e) => {
    const val = parseFloat(e.target.value);
    setZoomScale(val);
    if (threeRef.current.bagGroup) {
      threeRef.current.bagGroup.scale.set(val, val, val);
    }
  };

  const handleReset3D = () => {
    setAngleDeg(0);
    setTiltDeg(0);
    setZoomScale(1.0);
    setIsAutoRotating(false);
    if (threeRef.current.bagGroup) {
      threeRef.current.bagGroup.rotation.y = 0;
      threeRef.current.bagGroup.rotation.x = 0;
      threeRef.current.bagGroup.scale.set(1.0, 1.0, 1.0);
    }
  };

  if (!isOpen || !product) return null;

  // Direction label for 3D Angle
  const getAngleLabel = (d) => {
    const deg = Math.round(d);
    if (deg >= 20 && deg < 70) return 'Front-Right Angle (3/4 Profile)';
    if (deg >= 70 && deg < 110) return 'Right Side Profile • Leather Piping';
    if (deg >= 110 && deg < 160) return 'Rear-Right Angle';
    if (deg >= 160 && deg < 200) return 'Back View • Handwoven Pattern';
    if (deg >= 200 && deg < 250) return 'Rear-Left Angle';
    if (deg >= 250 && deg < 290) return 'Left Side Profile • Brass Anchor';
    if (deg >= 290 && deg < 340) return 'Front-Left Angle';
    return 'Front View (Ikat Weave)';
  };

  // WhatsApp Quote Text
  const handleWhatsApp = () => {
    const text = `Hello SambalKe Handlooms! I am viewing your online collection and am interested in price quotations for:\n\n*${product.title} (${product.id})*\n\nPlease share official quotations and handloom availability.`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[99999] bg-stone-950/95 backdrop-blur-2xl flex flex-col justify-between p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10 text-white shrink-0">
        
        {/* Product Details */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
            {product.id}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide font-serif">
                {product.title}
              </h3>
              <span className="hidden md:inline-block text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-stone-300 border border-white/10">
                {product.fabric}
              </span>
            </div>
            <p className="text-[11px] text-amber-200/80 font-mono">
              Dimensions: {product.dimensions}
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-white/10 rounded-xl border border-white/15 backdrop-blur-md text-xs font-bold">
          <button
            onClick={() => setViewMode('2d')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              viewMode === '2d'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <span>🖼️</span> Ultra-HD Photo
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              viewMode === '3d'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <span>🌟</span> 3D Angle Studio
          </button>
        </div>

        {/* Actions & Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleWishlist(productKey)}
            className={`btn-wishlist ${isWishlisted ? 'active' : ''}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            <span>{isWishlisted ? 'Saved' : 'Add to Interest'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center text-lg font-bold transition"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Main Showcase Stage - Maximized Canvas */}
      <div className="relative flex-1 my-2 flex items-center justify-center min-h-[460px] sm:min-h-[560px] md:min-h-[640px] w-full">
        
        {/* Navigation Arrows */}
        <button
          onClick={() => handleNavigate(-1)}
          className="absolute left-2 sm:left-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-amber-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition shadow-xl"
          title="Previous Bag (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleNavigate(1)}
          className="absolute right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-amber-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition shadow-xl"
          title="Next Bag (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* MODE 1: 2D Ultra-HD Photo Zoom - Maximized Size */}
        {viewMode === '2d' && (
          <div className="w-full h-full flex-1 flex flex-col items-center justify-center p-1 sm:p-3">
            <div className="relative w-full h-full flex items-center justify-center overflow-auto max-h-[75vh]">
              <img
                src={product.img}
                alt={product.title}
                onClick={() => setIsZoomed(!isZoomed)}
                className={`w-auto h-auto max-h-[72vh] max-w-[92vw] sm:max-w-[85vw] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)] transition-transform duration-300 rounded-2xl cursor-pointer ${
                  isZoomed ? 'scale-150 sm:scale-175 cursor-zoom-out' : 'cursor-zoom-in'
                }`}
                title="Click to toggle 150% zoom"
              />
            </div>
            <div className="mt-2 text-center text-xs text-stone-400 flex items-center gap-2">
              {isZoomed ? <ZoomOut className="w-4 h-4 text-amber-400" /> : <ZoomIn className="w-4 h-4 text-amber-400" />}
              <span>{isZoomed ? 'Click to reset view' : 'Click image to inspect weave details up close'}</span>
            </div>
          </div>
        )}

        {/* MODE 2: 3D Angle Studio */}
        {viewMode === '3d' && (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            
            {/* Direct Drag Hint */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-stone-900/80 text-amber-300 border border-amber-500/30 backdrop-blur-md shadow-md flex items-center gap-1.5">
                <span>🔄</span> Click & Drag canvas to rotate bag freely
              </span>
            </div>

            {/* Canvas Container */}
            <div
              ref={canvasContainerRef}
              className="relative w-full max-w-4xl h-[360px] sm:h-[450px] md:h-[500px] flex items-center justify-center cursor-grab active:cursor-grabbing"
            />

            {/* Floating 3D Controls Panel */}
            <div className="w-full max-w-2xl bg-stone-900/85 border border-white/10 rounded-2xl p-3 sm:p-4 backdrop-blur-xl space-y-2.5 z-20 shadow-xl mt-1">
              
              {/* Slider 1: 360 Rotation Angle */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-300 font-semibold flex items-center gap-1">
                    <span>🔄</span> 360° Viewing Angle:
                  </span>
                  <span className="text-amber-400 font-mono font-bold text-[11px]">
                    {Math.round(angleDeg)}° • {getAngleLabel(angleDeg)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={angleDeg}
                  onChange={handleAngleChange}
                />
              </div>

              {/* Slider 2 & 3: Tilt & Zoom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-stone-400 text-[11px]">
                    <span>Elevation / Tilt:</span>
                    <span className="font-mono text-amber-300">{Math.round(tiltDeg)}°</span>
                  </div>
                  <input
                    type="range"
                    min="-0.5"
                    max="0.5"
                    step="0.02"
                    value={tiltDeg}
                    onChange={handleTiltChange}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-stone-400 text-[11px]">
                    <span>Perspective Zoom:</span>
                    <span className="font-mono text-amber-300">{zoomScale.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.45"
                    step="0.05"
                    value={zoomScale}
                    onChange={handleZoomChange}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
                <button
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 transition font-medium flex items-center gap-1.5"
                >
                  {isAutoRotating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isAutoRotating ? 'Pause Spin' : 'Auto 360° Spin'}</span>
                </button>

                <button
                  onClick={handleReset3D}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-stone-400 hover:text-white transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset View</span>
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Bottom Thumbnail Ribbon & Quick Inquire */}
      <div className="pt-3 border-t border-white/10 space-y-3 shrink-0">
        
        {/* Weave Switcher Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {productKeys.map((k) => {
            const v = products[k];
            const isCur = k === productKey;
            const isWish = wishlist.includes(k);

            return (
              <button
                key={k}
                onClick={() => onSelectProduct(k)}
                className={`relative w-11 h-11 rounded-xl p-1 transition shrink-0 border ${
                  isCur
                    ? 'border-amber-400 ring-2 ring-amber-400/60 bg-white/25 scale-105'
                    : 'border-white/10 bg-white/5 hover:bg-white/15'
                }`}
                title={v.title}
              >
                <img src={v.img} alt={v.title} className="w-full h-full object-contain" />
                {isWish && (
                  <span className="absolute -top-1 -right-1 text-[10px]">❤️</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom CTA Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-stone-300">
            <span className="font-bold text-amber-400">{product.title}</span> • {product.fabric}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsApp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-md flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Inquiry</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onInquireFromModal(productKey);
              }}
              className="btn-primary"
            >
              <Send className="w-4 h-4" />
              <span>Request Official Quotation</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
